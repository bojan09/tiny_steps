import { notFound } from "next/navigation";
import { LearningLesson } from "@/components/learning-lesson";
import { lessonById } from "@/lib/learning/content";
import { lessonIds } from "@/lib/learning/model";
export const dynamicParams = false;
export function generateStaticParams() {
  return lessonIds.map((lesson) => ({ lesson }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lesson: string }>;
}) {
  const { lesson } = await params;
  return { title: lessonById(lesson)?.title || "Lesson not found" };
}
export default async function LessonPage({
  params,
}: {
  params: Promise<{ lesson: string }>;
}) {
  const { lesson } = await params;
  const content = lessonById(lesson);
  if (!content) notFound();
  return <LearningLesson key={content.id} id={content.id} />;
}
