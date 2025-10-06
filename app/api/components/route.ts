import { NextRequest, NextResponse } from 'next/server';
import { createComponent, getComponents, getComponentById } from '@/lib/firebase/firestore';
import { uploadComponentPreview, uploadComponentThumbnail } from '@/lib/firebase/storage';

// GET - Fetch components
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const framework = searchParams.get('framework');
    const sourceType = searchParams.get('sourceType');
    const authorId = searchParams.get('authorId');
    const limitCount = searchParams.get('limit');
    const orderByField = searchParams.get('orderBy');
    const orderDirection = searchParams.get('order') as 'asc' | 'desc';
    const includePrivate = searchParams.get('includePrivate') === 'true';

    // Fetch single component by ID
    if (id) {
      const component = await getComponentById(id);
      if (!component) {
        return NextResponse.json(
          { error: 'Component not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(component);
    }

    // If fetching by authorId with includePrivate flag, use Admin SDK
    if (authorId && includePrivate) {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Verify the user is requesting their own components
      const { adminDb, adminAuth } = await import('@/lib/firebase/admin');
      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      
      if (decodedToken.uid !== authorId) {
        return NextResponse.json(
          { error: 'Forbidden: Can only fetch your own private components' },
          { status: 403 }
        );
      }

      // Fetch all components by author (including private ones)
      let componentsQuery = adminDb.collection('components').where('authorId', '==', authorId);
      
      if (orderByField) {
        componentsQuery = componentsQuery.orderBy(orderByField, orderDirection || 'desc');
      }
      if (limitCount) {
        componentsQuery = componentsQuery.limit(parseInt(limitCount));
      }

      const snapshot = await componentsQuery.get();
      const components = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      return NextResponse.json(components);
    }

    // Fetch multiple public components with filters
    const components = await getComponents({
      category: category || undefined,
      framework: framework || undefined,
      sourceType: sourceType || undefined,
      authorId: authorId || undefined,
      limitCount: limitCount ? parseInt(limitCount) : undefined,
      orderByField: orderByField || 'createdAt',
      orderDirection: orderDirection || 'desc',
    });

    return NextResponse.json(components);
  } catch (error) {
    console.error('Error fetching components:', error);
    return NextResponse.json(
      { error: 'Failed to fetch components' },
      { status: 500 }
    );
  }
}

// POST - Create a new component
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const code = formData.get('code') as string;
    const category = formData.get('category') as string;
    const tags = JSON.parse(formData.get('tags') as string);
    const framework = formData.get('framework') as string;
    const language = formData.get('language') as 'typescript' | 'javascript';
    const styling = formData.get('styling') as string;
    const dependencies = JSON.parse(formData.get('dependencies') as string);
    const authorId = formData.get('authorId') as string;
    const authorName = formData.get('authorName') as string;
    const authorAvatar = formData.get('authorAvatar') as string;
    const isPublic = formData.get('isPublic') === 'true';
    const sourceType = formData.get('sourceType') as string;
    const sourceUrl = formData.get('sourceUrl') as string;
    const installCommand = formData.get('installCommand') as string;
    const usageInstructions = formData.get('usageInstructions') as string;
    const version = formData.get('version') as string;
    
    const previewFile = formData.get('previewImage') as File;
    const thumbnailFile = formData.get('thumbnailImage') as File | null;

    // Validate required fields
    if (!title || !description || !code || !authorId || !previewFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a temporary component ID for uploads
    const tempId = Date.now().toString();

    // Upload images
    const previewUrl = await uploadComponentPreview(previewFile, tempId);
    let thumbnailUrl: string | undefined;
    
    if (thumbnailFile) {
      thumbnailUrl = await uploadComponentThumbnail(thumbnailFile, tempId);
    }

    // Create component in Firestore
    const componentId = await createComponent({
      title,
      description,
      code,
      previewImage: previewUrl,
      thumbnailImage: thumbnailUrl,
      category: category as any,
      tags,
      framework: framework as any,
      language,
      styling: styling as any,
      dependencies,
      authorId,
      authorName,
      authorAvatar: authorAvatar || undefined,
      likes: 0,
      views: 0,
      copies: 0,
      isPublic,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: version || '1.0.0',
      sourceType: sourceType as any,
      sourceUrl: sourceUrl || undefined,
      installCommand: installCommand || undefined,
      usageInstructions: usageInstructions || undefined,
    });

    return NextResponse.json(
      { 
        success: true, 
        componentId,
        message: 'Component created successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating component:', error);
    return NextResponse.json(
      { error: 'Failed to create component' },
      { status: 500 }
    );
  }
}
