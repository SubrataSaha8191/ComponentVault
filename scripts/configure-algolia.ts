/**
 * Script to configure Algolia index settings
 * Run this once to set up optimal search configuration
 * 
 * Usage:
 * ALGOLIA_APP_ID=your_app_id ALGOLIA_ADMIN_KEY=your_admin_key npx tsx scripts/configure-algolia.ts
 * 
 * Or set environment variables in your shell first:
 * $env:ALGOLIA_APP_ID="your_app_id"; $env:ALGOLIA_ADMIN_KEY="your_admin_key"; npx tsx scripts/configure-algolia.ts
 */

import { algoliasearch } from 'algoliasearch';

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID!;
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY!;

if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) {
  console.error('❌ Error: ALGOLIA_APP_ID and ALGOLIA_ADMIN_KEY environment variables are required');
  console.log('\nUsage:');
  console.log('  PowerShell:');
  console.log('    $env:ALGOLIA_APP_ID="your_app_id"; $env:ALGOLIA_ADMIN_KEY="your_admin_key"; npx tsx scripts/configure-algolia.ts');
  console.log('\n  Or set them in your .env.local file and load them in your shell');
  process.exit(1);
}

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

async function configureAlgoliaSettings() {
  console.log('🔧 Configuring Algolia index settings...\n');

  try {
    // Configure Components Index
    console.log('⚙️  Configuring components index...');
    await client.setSettings({
      indexName: 'components',
      indexSettings: {
        // Searchable attributes (in order of importance)
        searchableAttributes: [
          'name',
          'description',
          'tags',
          'category',
          'authorName',
        ],
        
        // Attributes for faceting (filtering)
        attributesForFaceting: [
          'category',
          'framework',
          'frameworks',
          'tags',
          'isPremium',
          'isPublished',
          'authorId',
        ],
        
        // Custom ranking criteria
        customRanking: [
          'desc(downloads)',
          'desc(likes)',
          'desc(favorites)',
          'desc(accessibilityScore)',
          'desc(views)',
        ],
        
        // Attributes to retrieve
        attributesToRetrieve: [
          'name',
          'description',
          'category',
          'tags',
          'framework',
          'frameworks',
          'thumbnail',
          'authorName',
          'authorId',
          'downloads',
          'likes',
          'favorites',
          'views',
          'accessibilityScore',
          'isPremium',
          'isPublished',
        ],
        
        // Highlighting
        attributesToHighlight: ['name', 'description', 'tags'],
        
        // Snippet settings
        attributesToSnippet: ['description:30'],
        
        // Pagination
        hitsPerPage: 20,
        
        // Typo tolerance
        typoTolerance: true,
        minWordSizefor1Typo: 4,
        minWordSizefor2Typos: 8,
        
        // Advanced settings
        removeWordsIfNoResults: 'lastWords',
        exactOnSingleWordQuery: 'attribute',
      },
    });
    console.log('✅ Components index configured successfully\n');

    // Configure Users Index
    console.log('⚙️  Configuring users index...');
    await client.setSettings({
      indexName: 'users',
      indexSettings: {
        searchableAttributes: [
          'displayName',
          'username',
          'bio',
          'location',
        ],
        
        attributesForFaceting: [
          'isVerified',
          'location',
        ],
        
        customRanking: [
          'desc(componentsCount)',
          'desc(followersCount)',
        ],
        
        attributesToRetrieve: [
          'displayName',
          'username',
          'avatar',
          'bio',
          'location',
          'website',
          'componentsCount',
          'followersCount',
          'isVerified',
        ],
        
        attributesToHighlight: ['displayName', 'username', 'bio'],
        hitsPerPage: 20,
      },
    });
    console.log('✅ Users index configured successfully\n');

    // Configure Collections Index
    console.log('⚙️  Configuring collections index...');
    await client.setSettings({
      indexName: 'collections',
      indexSettings: {
        searchableAttributes: [
          'name',
          'description',
          'tags',
          'authorName',
        ],
        
        attributesForFaceting: [
          'isPublic',
          'tags',
          'authorId',
        ],
        
        customRanking: [
          'desc(likes)',
          'desc(views)',
          'desc(componentsCount)',
        ],
        
        attributesToRetrieve: [
          'name',
          'description',
          'tags',
          'thumbnail',
          'authorName',
          'authorId',
          'componentsCount',
          'likes',
          'views',
          'isPublic',
        ],
        
        attributesToHighlight: ['name', 'description'],
        hitsPerPage: 20,
      },
    });
    console.log('✅ Collections index configured successfully\n');

    console.log('🎉 All Algolia indices configured successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Deploy Firebase Functions: npm run deploy:functions');
    console.log('2. Run initial sync: npm run sync:algolia');
    
  } catch (error) {
    console.error('❌ Error configuring Algolia settings:', error);
    process.exit(1);
  }
}

// Run the configuration
configureAlgoliaSettings();
