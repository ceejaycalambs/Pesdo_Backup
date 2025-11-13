/**
 * Script to delete all jobseeker and employer files from Supabase Storage
 * 
 * USAGE:
 * 1. Install dependencies: npm install @supabase/supabase-js
 * 2. Update YOUR_SUPABASE_URL and YOUR_SERVICE_ROLE_KEY below
 * 3. Run: node delete_storage_files.js
 * 
 * WARNING: This will permanently delete all files!
 */

import { createClient } from '@supabase/supabase-js';

// ⚠️ UPDATE THESE VALUES
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_ROLE_KEY = 'YOUR_SERVICE_ROLE_KEY'; // Use service role key, not anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function deleteAllStorageFiles() {
  try {
    console.log('🗑️ Starting storage cleanup...\n');

    // Step 1: Delete all jobseeker profile files (resumes, profile pictures)
    console.log('📁 Deleting jobseeker profile files...');
    const { data: profileFolders, error: listProfilesError } = await supabase.storage
      .from('files')
      .list('profiles', {
        limit: 1000,
        offset: 0,
      });

    if (listProfilesError) {
      console.error('❌ Error listing profile folders:', listProfilesError);
    } else if (profileFolders && profileFolders.length > 0) {
      // Delete all files in each profile folder
      const deletePromises = profileFolders.map(async (folder) => {
        if (folder.name) {
          // List all files in this user's folder
          const { data: userFiles, error: listFilesError } = await supabase.storage
            .from('files')
            .list(`profiles/${folder.name}`, {
              limit: 1000,
              offset: 0,
            });

          if (listFilesError) {
            console.warn(`⚠️ Error listing files for ${folder.name}:`, listFilesError);
            return;
          }

          if (userFiles && userFiles.length > 0) {
            const filePaths = userFiles.map(file => `profiles/${folder.name}/${file.name}`);
            const { error: deleteError } = await supabase.storage
              .from('files')
              .remove(filePaths);

            if (deleteError) {
              console.error(`❌ Error deleting files for ${folder.name}:`, deleteError);
            } else {
              console.log(`✅ Deleted ${userFiles.length} files for ${folder.name}`);
            }
          }
        }
      });

      await Promise.all(deletePromises);
      console.log(`✅ Completed deletion for ${profileFolders.length} profile folders\n`);
    } else {
      console.log('ℹ️ No profile folders found\n');
    }

    // Step 2: Delete employer files (permits, legal documents, company logos)
    // Adjust these paths based on your actual storage structure
    const employerPaths = [
      'employers', // If you have an employers folder
      'legal-documents', // If legal documents are stored separately
      'permits', // If permits are stored separately
      'company-logos', // If company logos are stored separately
    ];

    for (const path of employerPaths) {
      console.log(`📁 Checking for files in ${path}...`);
      const { data: employerFiles, error: listEmployerError } = await supabase.storage
        .from('files')
        .list(path, {
          limit: 1000,
          offset: 0,
        });

      if (listEmployerError) {
        // Path might not exist, which is fine
        if (listEmployerError.message?.includes('not found')) {
          console.log(`ℹ️ Path ${path} does not exist, skipping...\n`);
        } else {
          console.warn(`⚠️ Error listing ${path}:`, listEmployerError);
        }
      } else if (employerFiles && employerFiles.length > 0) {
        // Recursively delete files
        const deleteRecursive = async (currentPath) => {
          const { data: items, error } = await supabase.storage
            .from('files')
            .list(currentPath, { limit: 1000, offset: 0 });

          if (error) return;

          for (const item of items || []) {
            const itemPath = `${currentPath}/${item.name}`;
            
            if (item.id === null) {
              // It's a folder, recurse
              await deleteRecursive(itemPath);
            } else {
              // It's a file, delete it
              const { error: deleteError } = await supabase.storage
                .from('files')
                .remove([itemPath]);

              if (deleteError) {
                console.error(`❌ Error deleting ${itemPath}:`, deleteError);
              } else {
                console.log(`✅ Deleted ${itemPath}`);
              }
            }
          }
        };

        await deleteRecursive(path);
        console.log(`✅ Completed deletion for ${path}\n`);
      } else {
        console.log(`ℹ️ No files found in ${path}\n`);
      }
    }

    console.log('✅ Storage cleanup completed!');
  } catch (error) {
    console.error('❌ Fatal error during storage cleanup:', error);
  }
}

// Run the cleanup
deleteAllStorageFiles();

