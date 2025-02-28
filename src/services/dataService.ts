
import { courses } from "@/data/courses";
import { fetchPublishedCourses, fetchCourseBySlug } from "./courseService";
import { Course } from "@/types/course";

// Function to get all courses
export async function getAllCourses(): Promise<Course[]> {
  try {
    // Try to fetch from Supabase
    const supabaseCourses = await fetchPublishedCourses();
    
    if (supabaseCourses && supabaseCourses.length > 0) {
      // Map to our Course type
      return supabaseCourses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level as 'beginner' | 'intermediate' | 'advanced',
        category: course.category as 'html' | 'css' | 'javascript' | 'python' | 'react' | 'other',
        duration: course.duration,
        modules: [], // We'll load these when needed for course detail page
        prerequisites: course.prerequisites,
        author: course.author,
        authorRole: course.author_role,
        imageUrl: course.image_url,
        published: course.published,
        slug: course.slug,
        popularity: course.popularity,
        rating: course.rating,
        reviewCount: course.review_count,
        updatedAt: course.updated_at,
        tags: course.tags,
        price: course.price,
        discount: course.discount,
        featured: course.featured,
        language: course.language as 'french' | 'english' | 'spanish' | 'german' | 'other',
        certificateAvailable: course.certificate_available
      }));
    }
    
    // Fallback to local data if no courses in Supabase yet
    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    // Fallback to local data if the API call fails
    return courses;
  }
}

// Function to get a course by slug
export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  try {
    // Try to fetch from Supabase
    const course = await fetchCourseBySlug(slug);
    return course;
  } catch (error) {
    console.error(`Error fetching course with slug ${slug}:`, error);
    // Fallback to local data if the API call fails
    return courses.find(course => course.slug === slug);
  }
}

// Function to get featured courses
export async function getFeaturedCourses(): Promise<Course[]> {
  const allCourses = await getAllCourses();
  return allCourses.filter(course => course.featured);
}

// Function to get courses by category
export async function getCoursesByCategory(category: string): Promise<Course[]> {
  const allCourses = await getAllCourses();
  return allCourses.filter(course => course.category === category);
}

// Function to get courses by level
export async function getCoursesByLevel(level: 'beginner' | 'intermediate' | 'advanced'): Promise<Course[]> {
  const allCourses = await getAllCourses();
  return allCourses.filter(course => course.level === level);
}

// Function to search courses
export async function searchCourses(query: string): Promise<Course[]> {
  const allCourses = await getAllCourses();
  query = query.toLowerCase();
  
  return allCourses.filter(course => 
    course.title.toLowerCase().includes(query) || 
    course.description.toLowerCase().includes(query) ||
    (course.tags && course.tags.some(tag => tag.toLowerCase().includes(query)))
  );
}
