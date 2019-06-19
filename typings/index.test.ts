import * as checkDiskSpace from 'check-disk-space';

(async () => {
  try {
    const diskSpace = await checkDiskSpace('/mnt/mygames');
    diskSpace.free;
    diskSpace.size;
  } catch (err) {
    if (err instanceof checkDiskSpace.InvalidPathError) {
      console.error('Invalid Path Error');
    } else if (err instanceof checkDiskSpace.NoMatchError) {
      console.error('No Match Error');
    } else {
      console.error('Error');
    }
  }
})();

checkDiskSpace.getFirstExistingParentPath('/path');
