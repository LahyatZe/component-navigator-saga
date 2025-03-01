
import { supabase } from "@/integrations/supabase/client";
import { Course, CourseModule, Lesson, Exercise, Resource, Quiz } from "@/types/course";

// Fetch all published courses
export const fetchPublishedCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .order('popularity', { ascending: false });

  if (error) {
    console.error('Error fetching courses:', error);
    throw new Error(error.message);
  }

  return data;
};

// Fetch a course by slug with all related data
export const fetchCourseBySlug = async (slug: string) => {
  // Fetch the course
  const { data: courseData, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .single();

  if (courseError) {
    console.error('Error fetching course:', courseError);
    throw new Error(courseError.message);
  }

  if (!courseData) {
    throw new Error('Course not found');
  }

  // Fetch modules for the course
  const { data: modulesData, error: modulesError } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', courseData.id)
    .order('order_index', { ascending: true });

  if (modulesError) {
    console.error('Error fetching modules:', modulesError);
    throw new Error(modulesError.message);
  }

  const modules: CourseModule[] = [];

  // For each module, fetch its lessons
  for (const module of modulesData) {
    const { data: lessonsData, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('module_id', module.id)
      .order('order_index', { ascending: true });

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError);
      throw new Error(lessonsError.message);
    }

    const lessons: Lesson[] = [];

    // For each lesson, fetch resources, exercises, and quizzes
    for (const lesson of lessonsData) {
      // Fetch resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .eq('lesson_id', lesson.id);

      if (resourcesError) {
        console.error('Error fetching resources:', resourcesError);
        throw new Error(resourcesError.message);
      }

      // Fetch exercises
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises')
        .select('*')
        .eq('lesson_id', lesson.id);

      if (exercisesError) {
        console.error('Error fetching exercises:', exercisesError);
        throw new Error(exercisesError.message);
      }

      const exercises: Exercise[] = [];

      // For each exercise, fetch test cases
      for (const exercise of exercisesData) {
        const { data: testCasesData, error: testCasesError } = await supabase
          .from('test_cases')
          .select('*')
          .eq('exercise_id', exercise.id)
          .eq('is_public', true);

        if (testCasesError) {
          console.error('Error fetching test cases:', testCasesError);
          throw new Error(testCasesError.message);
        }

        exercises.push({
          id: exercise.id,
          title: exercise.title,
          description: exercise.description,
          difficulty: exercise.difficulty as 'easy' | 'medium' | 'hard',
          codeTemplate: exercise.code_template,
          solution: exercise.solution,
          completed: false,
          hints: exercise.hints,
          testCases: testCasesData.map(tc => ({
            id: tc.id,
            input: tc.input,
            expectedOutput: tc.expected_output,
            isPublic: tc.is_public
          })),
          points: exercise.points
        });
      }

      // Fetch quizzes
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('lesson_id', lesson.id);

      if (quizzesError) {
        console.error('Error fetching quizzes:', quizzesError);
        throw new Error(quizzesError.message);
      }

      lessons.push({
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        duration: lesson.duration,
        completed: false,
        exercises: exercises,
        videoUrl: lesson.video_url,
        resources: resourcesData.map(r => ({
          id: r.id,
          title: r.title,
          type: r.type as 'article' | 'video' | 'book' | 'github' | 'documentation' | 'other',
          url: r.url,
          description: r.description
        })),
        quiz: quizzesData.map(q => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correct_answer,
          explanation: q.explanation
        })),
        order: lesson.order_index
      });
    }

    modules.push({
      id: module.id,
      title: module.title,
      description: module.description || undefined,
      lessons: lessons,
      duration: module.duration,
      order: module.order_index
    });
  }

  // Transform the course data to match our Course type
  const course: Course = {
    id: courseData.id,
    title: courseData.title,
    description: courseData.description,
    level: courseData.level as 'beginner' | 'intermediate' | 'advanced',
    category: courseData.category as 'html' | 'css' | 'javascript' | 'python' | 'react' | 'other',
    duration: courseData.duration,
    modules: modules,
    prerequisites: courseData.prerequisites,
    author: courseData.author,
    authorRole: courseData.author_role,
    imageUrl: courseData.image_url,
    published: courseData.published,
    slug: courseData.slug,
    popularity: courseData.popularity,
    rating: courseData.rating,
    reviewCount: courseData.review_count,
    updatedAt: courseData.updated_at,
    tags: courseData.tags,
    price: courseData.price,
    discount: courseData.discount,
    featured: courseData.featured,
    language: courseData.language as 'french' | 'english' | 'spanish' | 'german' | 'other',
    certificateAvailable: courseData.certificate_available
  };

  return course;
};

// Update the course with new data
export const updateCourse = async (courseId: string, courseData: Partial<Course>) => {
  const { data, error } = await supabase
    .from('courses')
    .update({
      title: courseData.title,
      description: courseData.description,
      level: courseData.level,
      category: courseData.category,
      duration: courseData.duration,
      prerequisites: courseData.prerequisites,
      author: courseData.author,
      author_role: courseData.authorRole,
      image_url: courseData.imageUrl,
      published: courseData.published,
      slug: courseData.slug,
      popularity: courseData.popularity,
      rating: courseData.rating,
      review_count: courseData.reviewCount,
      updated_at: new Date().toISOString(),
      tags: courseData.tags,
      price: courseData.price,
      discount: courseData.discount,
      featured: courseData.featured,
      language: courseData.language,
      certificate_available: courseData.certificateAvailable
    })
    .eq('id', courseId);

  if (error) {
    console.error('Error updating course:', error);
    throw new Error(error.message);
  }

  return data;
};

// Create a new course
export const createCourse = async (courseData: Omit<Course, 'id'>) => {
  const { data, error } = await supabase
    .from('courses')
    .insert({
      title: courseData.title,
      description: courseData.description,
      level: courseData.level,
      category: courseData.category,
      duration: courseData.duration,
      prerequisites: courseData.prerequisites || [],
      author: courseData.author,
      author_role: courseData.authorRole,
      image_url: courseData.imageUrl,
      published: courseData.published,
      slug: courseData.slug,
      popularity: courseData.popularity || 0,
      rating: courseData.rating,
      review_count: courseData.reviewCount || 0,
      tags: courseData.tags || [],
      price: courseData.price || 0,
      discount: courseData.discount || 0,
      featured: courseData.featured || false,
      language: courseData.language || 'french',
      certificate_available: courseData.certificateAvailable || false
    })
    .select();

  if (error) {
    console.error('Error creating course:', error);
    throw new Error(error.message);
  }

  return data[0];
};

// Upload a course image
export const uploadCourseImage = async (file: File, courseId: string) => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${courseId}/${Math.random()}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('course-images')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading image:', error);
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from('course-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
