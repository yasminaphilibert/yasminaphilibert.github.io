import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Media from "@/components/Media";
import TileMedia from "@/components/TileMedia";
import CompareSlider from "@/components/CompareSlider";
import PosterFlipbook from "@/components/PosterFlipbook";
import Video from "@/components/Video";
import Label from "@/components/Label";
import { getProjectBySlug, getServiceBySlug } from "@/data/services";

const Project = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : null;

  // Find next project within the same service
  const service = project ? getServiceBySlug(project.serviceSlug) : null;
  const projectsInService = service?.projects || [];
  const currentIndex = projectsInService.findIndex((p) => p.slug === slug);
  const nextProject = projectsInService[(currentIndex + 1) % projectsInService.length];

  if (!project || !service) {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <Header />
        <main className="container-custom py-24">
          <h1 className="display-heading text-[2rem] md:text-[3rem]">Project not found.</h1>
          <Link to="/" className="link-cta mt-6">
            Return home &rarr;
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />

      <main className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="mt-4 card-surface bg-lilac p-4 md:p-5"
        >
          <Media
            src={project.heroImage}
            alt={project.title}
            className="w-full h-[46vh] md:h-[64vh]"
            containerClassName="media-frame"
            objectPosition={project.heroImagePosition}
            autoplay={false}
            loop={true}
            muted={project.heroMuted ?? false}
            controls={true}
          />
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-4 card-surface bg-sand px-7 py-12 md:px-12 md:py-16"
        >
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-2">
              <Label>{project.serviceTitle}</Label>
            </div>

            <div className="md:col-span-6 min-w-0">
              <h1 className="display-heading text-[1.9rem] md:text-[3rem] break-words">{project.title}</h1>
              <div className="mt-7 space-y-5">
                {project.description.map((paragraph, index) => (
                  <p key={index} className="body-copy text-base md:text-lg font-medium break-words">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 space-y-8">
              <div className="space-y-1.5">
                <Label>{project.location}</Label>
                <Label>{project.year}</Label>
              </div>

              {project.tags && project.tags.length > 0 && (
                <div>
                  <Label className="mb-3">Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-sm font-medium text-ink px-3 py-1.5 rounded-full bg-ink/10 break-words"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.keywords && project.keywords.length > 0 && (
                <div>
                  <Label className="mb-3">Keywords</Label>
                  <p className="text-sm font-medium text-ink/80 break-words">{project.keywords.join(", ")}</p>
                </div>
              )}

              {project.toolsUsed && project.toolsUsed.length > 0 && (
                <div>
                  <Label className="mb-3">Tools used</Label>
                  <div className="flex flex-wrap gap-2">
                    {project.toolsUsed.map((tool, i) => (
                      <span
                        key={i}
                        className="text-sm font-medium text-ink px-3 py-1.5 rounded-full bg-ink/10 break-words"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* The campaign as a magazine. Wider than the comparison section
            because a spread is two pages across. */}
        {project.magazinePages && project.magazinePages.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="py-16 md:py-20"
          >
            <div className="max-w-6xl mx-auto">
              <p className="label mb-8 md:mb-10">
                The issue
                <span className="ml-3 normal-case tracking-normal font-medium text-ink/60">
                  drag a corner, or click the arrows
                </span>
              </p>
              <PosterFlipbook pages={project.magazinePages} label={project.title} />
            </div>
          </motion.section>
        )}

        {/* Model comparison: each poster is a sheet you click to turn. Single
            column and narrower than the gallery grid — at half width the posters'
            fine print stops being readable, which is the point of comparing them. */}
        {project.comparisonPairs && project.comparisonPairs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="py-16 md:py-20"
          >
            <div className="max-w-4xl mx-auto">
              <p className="label mb-8 md:mb-10">
                Two renderings
                <span className="ml-3 normal-case tracking-normal font-medium text-ink/60">
                  click to turn the page
                </span>
              </p>
              <div className="grid grid-cols-1 gap-10 md:gap-14">
                {project.comparisonPairs.map((pair, index) => (
                  <motion.figure
                    key={`compare-${index}`}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    className="m-0"
                  >
                    <CompareSlider
                      leftSrc={pair.left}
                      rightSrc={pair.right}
                      alt={pair.label}
                      // Rest with the top sheet down; click turns the page.
                      initial={100}
                      eager={index === 0}
                    />
                    {pair.label && <figcaption className="label mt-4">{pair.label}</figcaption>}
                  </motion.figure>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Gallery Images and Videos Grid */}
        {((project.galleryImages && project.galleryImages.length > 0) ||
          (project.galleryVideos && project.galleryVideos.length > 0)) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="py-16 md:py-20"
          >
            <Label className="pb-3 border-b border-ink/20">Gallery</Label>

            {/* Tiles vary in height, so the columns pack them rather than
                lining rows up and leaving gaps under the shorter ones. */}
            <div className="mt-6 columns-1 md:columns-2 gap-4">
              {project.galleryImages?.map((media, index) => (
                <motion.div
                  key={`media-${index}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: Math.min(index, 3) * 0.08 }}
                  className="card-surface bg-blush p-4 break-inside-avoid mb-4"
                >
                  <TileMedia
                    src={media}
                    alt={`${project.title} gallery ${index + 1}`}
                    className="w-full h-full transition-transform duration-[850ms] ease-out hover:scale-[1.035]"
                  />
                </motion.div>
              ))}

              {project.galleryVideos?.map((video, index) => {
                // Generate poster image path (same name but .jpg extension)
                const posterPath = video.replace(/\.(mp4|webm)$/, "_poster.jpg");
                return (
                  <motion.div
                    key={`video-${index}`}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: Math.min(index, 3) * 0.08 }}
                    className="card-surface bg-lilac p-4 break-inside-avoid mb-4"
                  >
                    <Video
                      src={video}
                      poster={posterPath}
                      alt={`${project.title} video ${index + 1}`}
                      // Every gallery video is 1080x1080, so square is their
                      // own shape and crops nothing.
                      aspectRatio="square"
                      className="media-frame"
                      autoplay={false}
                      loop={true}
                      muted={false}
                      controls={true}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        <nav className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-4 pb-4">
          <Link
            to={`/services/${project.serviceSlug}`}
            className="card-surface bg-ink text-paper px-7 py-10 md:px-9 flex flex-col justify-end transition-opacity duration-300 hover:opacity-90"
          >
            <span className="label text-paper/70">Back to</span>
            <span className="display-heading mt-3 text-[1.5rem] md:text-[2rem] text-paper break-words">
              {project.serviceTitle}
            </span>
          </Link>

          <Link
            to={`/project/${nextProject.slug}`}
            className="card-surface bg-blush px-7 py-10 md:px-9 flex flex-col justify-end transition-transform duration-500 hover:-translate-y-1"
          >
            <div className="flex items-baseline justify-between gap-4">
              <Label>Next project</Label>
              <Label>{nextProject.year}</Label>
            </div>
            <span className="display-heading mt-3 text-[1.5rem] md:text-[2rem] break-words">
              {nextProject.title}
            </span>
          </Link>
        </nav>
      </main>

      <Footer />
    </div>
  );
};

export default Project;
