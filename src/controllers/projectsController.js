import { Project } from "../models/Project.js";
import { ProjectsSection } from "../models/ProjectsSection.js";
import { createCrudController } from "../utils/crudFactory.js";
import { createSingletonController } from "../utils/singletonFactory.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUpload.js";
import { ApiError } from "../utils/ApiError.js";

export const { get: getSection, update: updateSection } = createSingletonController(ProjectsSection);
export const projects = createCrudController(Project);

export async function updateProjectImage(req, res) {
  if (!req.file) throw new ApiError(400, "No image file uploaded (field name: image)");

  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");

  const previousPublicId = project.image?.publicId;
  const { url, publicId } = await uploadBufferToCloudinary(req.file.buffer, {
    folder: "subhojit-portfolio/projects",
  });

  project.image = { url, publicId };
  await project.save();

  await deleteFromCloudinary(previousPublicId);
  res.json({ success: true, data: project });
}
