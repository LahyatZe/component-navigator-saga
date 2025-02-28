
import { supabase } from "@/integrations/supabase/client";
import { courses } from "@/data/courses";

// Migrate courses from local data to Supabase
export const migrateCoursesToSupabase = async () => {
  try {
    console.log("Starting data migration...");
    
    for (const course of courses) {
      console.log(`Migrating course: ${course.title}`);
      
      // Check if course already exists
      const { data: existingCourse } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', course.slug)
        .maybeSingle();
      
      if (existingCourse) {
        console.log(`Course ${course.title} already exists, skipping...`);
        continue;
      }
      
      // Insert course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: course.title,
          description: course.description,
          level: course.level,
          category: course.category,
          duration: course.duration,
          prerequisites: course.prerequisites,
          author: course.author,
          author_role: course.authorRole,
          image_url: course.imageUrl,
          published: course.published,
          slug: course.slug,
          popularity: course.popularity || 0,
          rating: course.rating,
          review_count: course.reviewCount || 0,
          tags: course.tags || [],
          price: course.price || 0,
          discount: course.discount || 0,
          featured: course.featured || false,
          language: course.language || 'french',
          certificate_available: course.certificateAvailable || false
        })
        .select();
      
      if (courseError) {
        console.error(`Error inserting course ${course.title}:`, courseError);
        continue;
      }
      
      const courseId = courseData[0].id;
      
      // Insert modules
      for (let moduleIndex = 0; moduleIndex < course.modules.length; moduleIndex++) {
        const module = course.modules[moduleIndex];
        
        const { data: moduleData, error: moduleError } = await supabase
          .from('modules')
          .insert({
            course_id: courseId,
            title: module.title,
            description: module.description,
            order_index: module.order || moduleIndex,
            duration: module.duration
          })
          .select();
        
        if (moduleError) {
          console.error(`Error inserting module ${module.title}:`, moduleError);
          continue;
        }
        
        const moduleId = moduleData[0].id;
        
        // Insert lessons
        for (let lessonIndex = 0; lessonIndex < module.lessons.length; lessonIndex++) {
          const lesson = module.lessons[lessonIndex];
          
          const { data: lessonData, error: lessonError } = await supabase
            .from('lessons')
            .insert({
              module_id: moduleId,
              title: lesson.title,
              content: lesson.content,
              duration: lesson.duration,
              video_url: lesson.videoUrl,
              order_index: lesson.order || lessonIndex
            })
            .select();
          
          if (lessonError) {
            console.error(`Error inserting lesson ${lesson.title}:`, lessonError);
            continue;
          }
          
          const lessonId = lessonData[0].id;
          
          // Insert exercises
          for (const exercise of lesson.exercises) {
            const { data: exerciseData, error: exerciseError } = await supabase
              .from('exercises')
              .insert({
                lesson_id: lessonId,
                title: exercise.title,
                description: exercise.description,
                difficulty: exercise.difficulty,
                code_template: exercise.codeTemplate,
                solution: exercise.solution,
                hints: exercise.hints || [],
                points: exercise.points || 10
              })
              .select();
            
            if (exerciseError) {
              console.error(`Error inserting exercise ${exercise.title}:`, exerciseError);
              continue;
            }
            
            const exerciseId = exerciseData[0].id;
            
            // Insert test cases
            if (exercise.testCases) {
              for (const testCase of exercise.testCases) {
                const { error: testCaseError } = await supabase
                  .from('test_cases')
                  .insert({
                    exercise_id: exerciseId,
                    input: testCase.input,
                    expected_output: testCase.expectedOutput,
                    is_public: testCase.isPublic
                  });
                
                if (testCaseError) {
                  console.error(`Error inserting test case:`, testCaseError);
                }
              }
            }
          }
          
          // Insert resources
          if (lesson.resources) {
            for (const resource of lesson.resources) {
              const { error: resourceError } = await supabase
                .from('resources')
                .insert({
                  lesson_id: lessonId,
                  title: resource.title,
                  type: resource.type,
                  url: resource.url,
                  description: resource.description
                });
              
              if (resourceError) {
                console.error(`Error inserting resource ${resource.title}:`, resourceError);
              }
            }
          }
          
          // Insert quizzes
          if (lesson.quiz) {
            for (const quiz of lesson.quiz) {
              const { error: quizError } = await supabase
                .from('quizzes')
                .insert({
                  lesson_id: lessonId,
                  question: quiz.question,
                  options: quiz.options,
                  correct_answer: quiz.correctAnswer,
                  explanation: quiz.explanation
                });
              
              if (quizError) {
                console.error(`Error inserting quiz:`, quizError);
              }
            }
          }
        }
      }
      
      console.log(`Successfully migrated course: ${course.title}`);
    }
    
    console.log("Data migration completed successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error during data migration:", error);
    return { success: false, error };
  }
};
