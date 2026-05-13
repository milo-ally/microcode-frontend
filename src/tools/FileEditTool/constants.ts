// In its own file to avoid circular dependencies
export const FILE_EDIT_TOOL_NAME = 'Edit'

// Permission pattern for granting session-level access to the project's .microcode/ folder
export const MICROCODE_FOLDER_PERMISSION_PATTERN = '/.microcode/**'

// Permission pattern for granting session-level access to the global ~/.microcode/ folder
export const GLOBAL_MICROCODE_FOLDER_PERMISSION_PATTERN = '~/.microcode/**'

export const FILE_UNEXPECTEDLY_MODIFIED_ERROR =
  'File has been unexpectedly modified. Read it again before attempting to write it.'
