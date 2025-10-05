'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

interface ComponentFormData {
  title: string;
  description: string;
  code: string;
  category: string;
  tags: string;
  framework: string;
  language: 'typescript' | 'javascript';
  styling: string;
  dependencies: string;
  sourceType: string;
  sourceUrl: string;
  installCommand: string;
  usageInstructions: string;
  isPublic: boolean;
}

export default function UploadComponentForm() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<ComponentFormData>({
    title: '',
    description: '',
    code: '',
    category: 'button',
    tags: '',
    framework: 'react',
    language: 'typescript',
    styling: 'tailwind',
    dependencies: '',
    sourceType: 'custom',
    sourceUrl: '',
    installCommand: '',
    usageInstructions: '',
    isPublic: true,
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fileType: 'preview' | 'thumbnail') => {
    const file = e.target.files?.[0];
    if (file) {
      if (fileType === 'preview') {
        setPreviewFile(file);
      } else {
        setThumbnailFile(file);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      alert('Please sign in to upload components');
      return;
    }

    if (!previewFile) {
      alert('Please upload a preview image');
      return;
    }

    setUploading(true);

    try {
      const uploadFormData = new FormData();

      // Add all text fields
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('code', formData.code);
      uploadFormData.append('category', formData.category);
      uploadFormData.append('framework', formData.framework);
      uploadFormData.append('language', formData.language);
      uploadFormData.append('styling', formData.styling);
      uploadFormData.append('sourceType', formData.sourceType);
      uploadFormData.append('isPublic', formData.isPublic.toString());
      uploadFormData.append('version', '1.0.0');

      // Parse and add arrays
      const tags = formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
      uploadFormData.append('tags', JSON.stringify(tags));

      const dependencies = formData.dependencies
        ? formData.dependencies.split(',').map((dep) => dep.trim()).filter(Boolean)
        : [];
      uploadFormData.append('dependencies', JSON.stringify(dependencies));

      // Add optional fields
      if (formData.sourceUrl) uploadFormData.append('sourceUrl', formData.sourceUrl);
      if (formData.installCommand) uploadFormData.append('installCommand', formData.installCommand);
      if (formData.usageInstructions) uploadFormData.append('usageInstructions', formData.usageInstructions);

      // Add author info
      uploadFormData.append('authorId', user.uid);
      uploadFormData.append('authorName', user.displayName || 'Anonymous');
      if (user.photoURL) uploadFormData.append('authorAvatar', user.photoURL);

      // Add files
      uploadFormData.append('previewImage', previewFile);
      if (thumbnailFile) uploadFormData.append('thumbnailImage', thumbnailFile);

      const response = await fetch('/api/components', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success) {
        alert('Component uploaded successfully!');
        router.push(`/component/${result.componentId}`);
      } else {
        alert('Failed to upload component: ' + result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('An error occurred while uploading');
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Upload Component</h1>
        <p>Please sign in to upload components.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Upload Component</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Animated Button Component"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your component..."
          />
        </div>

        {/* Code */}
        <div>
          <label htmlFor="code" className="block text-sm font-medium mb-2">
            Code *
          </label>
          <textarea
            id="code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            required
            rows={10}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="Paste your component code here..."
          />
        </div>

        {/* Preview Image */}
        <div>
          <label htmlFor="previewImage" className="block text-sm font-medium mb-2">
            Preview Image *
          </label>
          <input
            type="file"
            id="previewImage"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'preview')}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          {previewFile && (
            <p className="text-sm text-gray-600 mt-2">Selected: {previewFile.name}</p>
          )}
        </div>

        {/* Thumbnail Image (Optional) */}
        <div>
          <label htmlFor="thumbnailImage" className="block text-sm font-medium mb-2">
            Thumbnail Image (Optional)
          </label>
          <input
            type="file"
            id="thumbnailImage"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'thumbnail')}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {thumbnailFile && (
            <p className="text-sm text-gray-600 mt-2">Selected: {thumbnailFile.name}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="button">Button</option>
            <option value="card">Card</option>
            <option value="form">Form</option>
            <option value="input">Input</option>
            <option value="navigation">Navigation</option>
            <option value="modal">Modal</option>
            <option value="table">Table</option>
            <option value="layout">Layout</option>
            <option value="chart">Chart</option>
            <option value="authentication">Authentication</option>
            <option value="dashboard">Dashboard</option>
            <option value="ecommerce">E-commerce</option>
            <option value="landing-page">Landing Page</option>
            <option value="animation">Animation</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., button, animated, hover-effect"
          />
        </div>

        {/* Framework */}
        <div>
          <label htmlFor="framework" className="block text-sm font-medium mb-2">
            Framework *
          </label>
          <select
            id="framework"
            name="framework"
            value={formData.framework}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="react">React</option>
            <option value="next">Next.js</option>
            <option value="vue">Vue</option>
            <option value="angular">Angular</option>
            <option value="svelte">Svelte</option>
            <option value="vanilla">Vanilla JS</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium mb-2">
            Language *
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>

        {/* Styling */}
        <div>
          <label htmlFor="styling" className="block text-sm font-medium mb-2">
            Styling Framework *
          </label>
          <select
            id="styling"
            name="styling"
            value={formData.styling}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="tailwind">Tailwind CSS</option>
            <option value="css">CSS</option>
            <option value="scss">SCSS</option>
            <option value="styled-components">Styled Components</option>
            <option value="emotion">Emotion</option>
            <option value="css-modules">CSS Modules</option>
          </select>
        </div>

        {/* Source Type */}
        <div>
          <label htmlFor="sourceType" className="block text-sm font-medium mb-2">
            Source Type *
          </label>
          <select
            id="sourceType"
            name="sourceType"
            value={formData.sourceType}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="custom">Custom (Your Own)</option>
            <option value="bootstrap">Bootstrap</option>
            <option value="flowbite">Flowbite</option>
            <option value="radix">Radix UI</option>
            <option value="shadcn">shadcn/ui</option>
            <option value="material-ui">Material UI</option>
            <option value="chakra">Chakra UI</option>
            <option value="ant-design">Ant Design</option>
          </select>
        </div>

        {/* Dependencies */}
        <div>
          <label htmlFor="dependencies" className="block text-sm font-medium mb-2">
            Dependencies (comma-separated)
          </label>
          <input
            type="text"
            id="dependencies"
            name="dependencies"
            value={formData.dependencies}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., framer-motion, lucide-react"
          />
        </div>

        {/* Install Command */}
        <div>
          <label htmlFor="installCommand" className="block text-sm font-medium mb-2">
            Install Command (Optional)
          </label>
          <input
            type="text"
            id="installCommand"
            name="installCommand"
            value={formData.installCommand}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., npm install framer-motion"
          />
        </div>

        {/* Usage Instructions */}
        <div>
          <label htmlFor="usageInstructions" className="block text-sm font-medium mb-2">
            Usage Instructions (Optional)
          </label>
          <textarea
            id="usageInstructions"
            name="usageInstructions"
            value={formData.usageInstructions}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="How to use this component..."
          />
        </div>

        {/* Public/Private */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="isPublic" className="ml-2 text-sm font-medium">
            Make this component public
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Uploading...' : 'Upload Component'}
        </button>
      </form>
    </div>
  );
}
