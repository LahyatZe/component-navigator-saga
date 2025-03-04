export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          condition: string
          created_at: string | null
          description: string
          icon: string
          id: string
          title: string
        }
        Insert: {
          condition: string
          created_at?: string | null
          description: string
          icon: string
          id?: string
          title: string
        }
        Update: {
          condition?: string
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          author: string
          author_role: string | null
          category: string
          certificate_available: boolean | null
          created_at: string | null
          description: string
          discount: number | null
          duration: number
          featured: boolean | null
          id: string
          image_url: string | null
          language: string | null
          level: string
          popularity: number | null
          prerequisites: string[] | null
          price: number | null
          published: boolean | null
          rating: number | null
          review_count: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author: string
          author_role?: string | null
          category: string
          certificate_available?: boolean | null
          created_at?: string | null
          description: string
          discount?: number | null
          duration: number
          featured?: boolean | null
          id?: string
          image_url?: string | null
          language?: string | null
          level: string
          popularity?: number | null
          prerequisites?: string[] | null
          price?: number | null
          published?: boolean | null
          rating?: number | null
          review_count?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          author_role?: string | null
          category?: string
          certificate_available?: boolean | null
          created_at?: string | null
          description?: string
          discount?: number | null
          duration?: number
          featured?: boolean | null
          id?: string
          image_url?: string | null
          language?: string | null
          level?: string
          popularity?: number | null
          prerequisites?: string[] | null
          price?: number | null
          published?: boolean | null
          rating?: number | null
          review_count?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      exercises: {
        Row: {
          code_template: string | null
          created_at: string | null
          description: string
          difficulty: string
          hints: string[] | null
          id: string
          lesson_id: string
          points: number | null
          solution: string | null
          title: string
        }
        Insert: {
          code_template?: string | null
          created_at?: string | null
          description: string
          difficulty: string
          hints?: string[] | null
          id?: string
          lesson_id: string
          points?: number | null
          solution?: string | null
          title: string
        }
        Update: {
          code_template?: string | null
          created_at?: string | null
          description?: string
          difficulty?: string
          hints?: string[] | null
          id?: string
          lesson_id?: string
          points?: number | null
          solution?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string
          created_at: string | null
          duration: number
          id: string
          module_id: string
          order_index: number
          title: string
          video_url: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          duration: number
          id?: string
          module_id: string
          order_index: number
          title: string
          video_url?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          duration?: number
          id?: string
          module_id?: string
          order_index?: number
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          order_index: number
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          order_index: number
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          correct_answer: number
          created_at: string | null
          explanation: string | null
          id: string
          lesson_id: string
          options: Json
          question: string
        }
        Insert: {
          correct_answer: number
          created_at?: string | null
          explanation?: string | null
          id?: string
          lesson_id: string
          options: Json
          question: string
        }
        Update: {
          correct_answer?: number
          created_at?: string | null
          explanation?: string | null
          id?: string
          lesson_id?: string
          options?: Json
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          lesson_id: string
          title: string
          type: string
          url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          lesson_id: string
          title: string
          type: string
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          lesson_id?: string
          title?: string
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      test_cases: {
        Row: {
          created_at: string | null
          exercise_id: string
          expected_output: string
          id: string
          input: string
          is_public: boolean | null
        }
        Insert: {
          created_at?: string | null
          exercise_id: string
          expected_output: string
          id?: string
          input: string
          is_public?: boolean | null
        }
        Update: {
          created_at?: string | null
          exercise_id?: string
          expected_output?: string
          id?: string
          input?: string
          is_public?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "test_cases_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          created_at: string | null
          id: string
          is_unlocked: boolean | null
          progress: number | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          created_at?: string | null
          id?: string
          is_unlocked?: boolean | null
          progress?: number | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          created_at?: string | null
          id?: string
          is_unlocked?: boolean | null
          progress?: number | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_portfolio_progress: {
        Row: {
          achievements: string[] | null
          created_at: string | null
          current_level: number | null
          id: string
          last_updated: string | null
          quiz_history: Json | null
          unlocked_years: string[] | null
          user_id: string
        }
        Insert: {
          achievements?: string[] | null
          created_at?: string | null
          current_level?: number | null
          id?: string
          last_updated?: string | null
          quiz_history?: Json | null
          unlocked_years?: string[] | null
          user_id: string
        }
        Update: {
          achievements?: string[] | null
          created_at?: string | null
          current_level?: number | null
          id?: string
          last_updated?: string | null
          quiz_history?: Json | null
          unlocked_years?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          bookmarks: string[] | null
          certificate_issued: boolean | null
          completed_exercises: string[] | null
          completed_lessons: string[] | null
          completion_percentage: number | null
          course_id: string
          created_at: string | null
          current_lesson: string | null
          current_level: number | null
          cv_downloaded: boolean | null
          id: string
          last_accessed_at: string | null
          notes: Json | null
          quiz_history: Json | null
          quiz_scores: Json | null
          started_at: string | null
          unlocked_years: string[] | null
          used_hints: Json | null
          user_id: string
        }
        Insert: {
          bookmarks?: string[] | null
          certificate_issued?: boolean | null
          completed_exercises?: string[] | null
          completed_lessons?: string[] | null
          completion_percentage?: number | null
          course_id: string
          created_at?: string | null
          current_lesson?: string | null
          current_level?: number | null
          cv_downloaded?: boolean | null
          id?: string
          last_accessed_at?: string | null
          notes?: Json | null
          quiz_history?: Json | null
          quiz_scores?: Json | null
          started_at?: string | null
          unlocked_years?: string[] | null
          used_hints?: Json | null
          user_id: string
        }
        Update: {
          bookmarks?: string[] | null
          certificate_issued?: boolean | null
          completed_exercises?: string[] | null
          completed_lessons?: string[] | null
          completion_percentage?: number | null
          course_id?: string
          created_at?: string | null
          current_lesson?: string | null
          current_level?: number | null
          cv_downloaded?: boolean | null
          id?: string
          last_accessed_at?: string | null
          notes?: Json | null
          quiz_history?: Json | null
          quiz_scores?: Json | null
          started_at?: string | null
          unlocked_years?: string[] | null
          used_hints?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          bio: string | null
          full_name: string | null
          id: string
          last_updated: string | null
          preferences: Json
          user_id: string
        }
        Insert: {
          bio?: string | null
          full_name?: string | null
          id?: string
          last_updated?: string | null
          preferences?: Json
          user_id: string
        }
        Update: {
          bio?: string | null
          full_name?: string | null
          id?: string
          last_updated?: string | null
          preferences?: Json
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
