import { existsSync } from "fs";
import { join, normalize } from "path";

export function loadPathToProjectRoot(): string {
  const srcStoriesDirectory: string = __dirname;
  const projectRootDirectory: string = normalize(
    join(srcStoriesDirectory, "..", ".."),
  );

  if (
    !existsSync(join(projectRootDirectory, "package.json")) ||
    !existsSync(join(projectRootDirectory, ".storybook"))
  ) {
    throw new Error(
      "Failed to resolve 'package.json' and '.storybook' directories to ensure that this is the project root!",
    );
  }

  return projectRootDirectory;
}

export default loadPathToProjectRoot;
