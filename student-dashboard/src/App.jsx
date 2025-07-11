/**
 * Student Management Dashboard - Main Application Component
 * 
 * This is a comprehensive React application for managing student data with full CRUD operations.
 * It demonstrates modern React patterns, async operations, form handling, and API integration.
 * 
 * Key Features:
 * - Student CRUD operations (Create, Read, Update, Delete)
 * - Form validation and error handling
 * - Responsive UI with Tailwind CSS and Shadcn components
 * - MockAPI.io integration for data persistence
 * - Real-time statistics and dashboard metrics
 * 
 * Technical Concepts Demonstrated:
 * - React Hooks (useState, useEffect)
 * - Async/Await for API calls
 * - Event handling and form management
 * - Component composition and reusability
 * - State management patterns
 * - Error handling in async operations
 */

// React core imports - Essential hooks for state and lifecycle management
import { useState, useEffect } from 'react';

// Shadcn UI component imports - Pre-built, accessible components
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';

// Lucide React icons - Lightweight, customizable icons
import { Trash2, Edit, Plus, Users, BookOpen, GraduationCap } from 'lucide-react';

// Global styles including Tailwind CSS
import './App.css';

// ==================== API CONFIGURATION ====================
/**
 * API Configuration Constants
 * 
 * These constants define the endpoints for our MockAPI.io integration.
 * MockAPI.io provides a REST API for prototyping and development.
  */
const MOCKAPI_BASE_URL = 'https://68710f827ca4d06b34b92fc0.mockapi.io';
const COURSES_API_URL = `${MOCKAPI_BASE_URL}/Courses`;
const STUDENTS_API_URL = `${MOCKAPI_BASE_URL}/Students`;

// ==================== MAIN APPLICATION COMPONENT ====================
/**
 * App Component - Main application container
 * 
 * This component serves as the root of our Student Management Dashboard.
 * It manages all application state, handles API interactions, and renders the UI.
 * 
 * State Management Pattern:
 * - Uses React's built-in useState for local component state
 * - Separates concerns: data state, UI state, and form state
 * - Implements controlled components for form inputs
 * 
 * @returns {JSX.Element} The rendered application
 */
function App() {
  // ==================== STATE DECLARATIONS ====================
  
  /**
   * Data State - Application's core data
   * 
   * These state variables store the main application data fetched from APIs.
   * They represent the "single source of truth" for our application.
   */
  const [students, setStudents] = useState([]); // Array of student objects
  const [courses, setCourses] = useState([]);   // Array of available courses

  /**
   * UI State - Controls modal/dialog visibility
   * 
   * These boolean states control the visibility of various UI components.
   * They help manage the application's user interface state.
   */
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);     // Add student dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);   // Edit student dialog

  /**
   * Form State - Manages form data and validation
   * 
   * These states handle form inputs, validation, and the editing workflow.
   * They provide a controlled form experience with real-time validation.
   */
  const [editingStudent, setEditingStudent] = useState(null);        // Currently editing student
  const [formData, setFormData] = useState({                        // Form input values
    name: '',
    email: '',
    course: '', // Stores course code (e.g., 'CS101')
  });
  const [errors, setErrors] = useState({});                          // Validation errors

  // ==================== LIFECYCLE EFFECTS ====================
  
  /**
   * Course Data Fetching Effect
   * 
   * This useEffect hook fetches course data when the component mounts.
   * It demonstrates:
   * - Async/await pattern for API calls
   * - Error handling in async operations
   * - useEffect with empty dependency array (runs once)
   * 
   * The Event Loop and Async Behavior:
   * 1. useEffect callback is synchronous, but we define an async function inside
   * 2. fetch() returns a Promise, which is handled by await
   * 3. While waiting for the API response, other code can execute
   * 4. Once resolved, the state update triggers a re-render
   */
  useEffect(() => {
    /**
     * Async function to fetch courses from MockAPI
     * 
     * This pattern (async function inside useEffect) is necessary because:
     * - useEffect callback cannot be async directly
     * - We need async/await for clean Promise handling
     * - Error handling is more readable with try/catch
     */
    const fetchCourses = async () => {
      try {
        // Fetch data from MockAPI.io
        const response = await fetch(COURSES_API_URL);
        
        // Check if the HTTP response indicates success (200-299 status codes)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse JSON response body
        const data = await response.json();
        
        // Update state with fetched data (triggers re-render)
        setCourses(data);
      } catch (error) {
        // Log error for debugging
        console.error('Error fetching courses:', error);
        
        // In production, you might want to:
        // - Show user-friendly error message
        // - Set error state for UI feedback
        // - Implement retry logic
        // - Log to error tracking service
      }
    };

    // Execute the async function
    fetchCourses();
  }, []); // Empty dependency array = run once on mount

  /**
   * Student Data Fetching Effect
   * 
   * Similar to courses fetch, but for student data.
   * This demonstrates the same async patterns and error handling.
   */
  useEffect(() => {
    /**
     * Async function to fetch students from MockAPI
     * 
     * Follows the same pattern as fetchCourses for consistency.
     */
    const fetchStudents = async () => {
      try {
        const response = await fetch(STUDENTS_API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
        // Handle error appropriately for your application
      }
    };

    fetchStudents();
  }, []); // Empty dependency array = run once on mount

  // ==================== FORM VALIDATION ====================
  
  /**
   * Form Validation Function
   * 
   * Validates form data and sets error messages.
   * This function demonstrates:
   * - Input validation patterns
   * - Regular expressions for email validation
   * - Object manipulation for error tracking
   * - Boolean logic for validation success
   * 
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {}; // Object to collect validation errors

    // Name validation - check for empty/whitespace-only strings
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation - check for presence and format
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      // Regular expression for basic email format validation
      newErrors.email = 'Please enter a valid email address';
    }

    // Course validation - check if a course is selected
    if (!formData.course) {
      newErrors.course = 'Course selection is required';
    }

    // Update errors state
    setErrors(newErrors);
    
    // Return true if no errors found (Object.keys().length === 0)
    return Object.keys(newErrors).length === 0;
  };

  // ==================== CRUD OPERATIONS ====================
  
  /**
   * Add Student Handler
   * 
   * Handles form submission for adding new students.
   * Demonstrates:
   * - Event handling (preventDefault)
   * - Form validation before submission
   * - HTTP POST request with JSON payload
   * - Optimistic UI updates
   * - Error handling for network requests
   * 
   * @param {Event} e - Form submission event
   */
  const handleAddStudent = async (e) => {
    // Prevent default form submission (page reload)
    e.preventDefault();

    // Validate form before proceeding
    if (!validateForm()) return;

    // Prepare data for API request
    const newStudentData = {
      ...formData // Spread operator to copy all form fields
    };

    try {
      // Send POST request to create new student
      const response = await fetch(STUDENTS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify JSON content type
        },
        body: JSON.stringify(newStudentData), // Convert object to JSON string
      });

      // Check if request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse response (MockAPI returns created object with generated ID)
      const addedStudent = await response.json();
      
      // Update local state with new student
      // Using functional update to ensure we have the latest state
      setStudents(prevStudents => [...prevStudents, addedStudent]);
      
      // Reset form and close dialog
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding student:', error);
      // In production, show user-friendly error message
      // Consider implementing toast notifications or error states
    }
  };

  /**
   * Edit Student Handler
   * 
   * Handles form submission for editing existing students.
   * Similar to add handler but uses PUT method and updates existing record.
   * 
   * @param {Event} e - Form submission event
   */
  const handleEditStudent = async (e) => {
    e.preventDefault();

    // Validate form before proceeding
    if (!validateForm()) return;

    // Prepare updated data
    const updatedStudentData = {
      ...formData
    };

    try {
      // Send PUT request to update student
      // Note: Template literal for dynamic URL with student ID
      const response = await fetch(`${STUDENTS_API_URL}/${editingStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStudentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedStudent = await response.json();
      
      // Update student in local state using map function
      // This pattern preserves array immutability
      setStudents(prevStudents => 
        prevStudents.map(student =>
          student.id === updatedStudent.id ? updatedStudent : student
        )
      );
      
      // Reset form and close dialog
      resetForm();
      setIsEditDialogOpen(false);
      setEditingStudent(null);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  /**
   * Delete Student Handler
   * 
   * Handles student deletion with confirmation.
   * Demonstrates:
   * - User confirmation patterns
   * - HTTP DELETE requests
   * - Array filtering for state updates
   * - Error handling
   * 
   * @param {string} id - ID of student to delete
   */
  const handleDeleteStudent = async (id) => {
    // Confirm deletion with user
    // In production, consider using a custom modal for better UX
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      // Send DELETE request
      const response = await fetch(`${STUDENTS_API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove student from local state using filter
      // Filter creates a new array without the deleted student
      setStudents(prevStudents => 
        prevStudents.filter(student => student.id !== id)
      );
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  // ==================== UI INTERACTION HANDLERS ====================
  
  /**
   * Edit Button Click Handler
   * 
   * Prepares the edit form with selected student data.
   * This function demonstrates:
   * - State management for editing workflow
   * - Form population with existing data
   * - Modal/dialog control
   * 
   * @param {Object} student - Student object to edit
   */
  const handleEditClick = (student) => {
    // Set the student being edited
    setEditingStudent(student);
    
    // Populate form with student data
    setFormData({
      name: student.name,
      email: student.email,
      course: student.course,
    });
    
    // Open edit dialog
    setIsEditDialogOpen(true);
  };

  /**
   * Form Reset Function
   * 
   * Resets all form-related state to initial values.
   * This ensures clean state when opening/closing dialogs.
   */
  const resetForm = () => {
    setFormData({ name: '', email: '', course: '' });
    setErrors({});
    setEditingStudent(null);
  };

  /**
   * Course Name Helper Function
   * 
   * Finds course name by course code.
   * Demonstrates:
   * - Array.find() method
   * - Conditional return values
   * - Data transformation
   * 
   * @param {string} courseCode - Course code to look up
   * @returns {string} Course name or code if not found
   */
  const getCourseName = (courseCode) => {
    const course = courses.find(c => c.code === courseCode);
    return course ? course.name : courseCode;
  };

  // ==================== RENDER METHOD ====================
  
  /**
   * Component Render
   * 
   * Returns the JSX for the entire application.
   * This demonstrates:
   * - Conditional rendering
   * - Component composition
   * - Event binding
   * - Responsive design with Tailwind classes
   * - Accessibility considerations
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* ==================== HEADER SECTION ==================== */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-lg shadow-md">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-foreground leading-tight">
                Student Management Dashboard
              </h1>
              <p className="text-muted-foreground mt-1 text-lg">
                Manage your students efficiently and effectively
              </p>
            </div>
          </div>

          {/* ==================== STATISTICS CARDS ==================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            
            {/* Total Students Card */}
            <Card className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold text-foreground">{students.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Courses Card */}
            <Card className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <BookOpen className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Available Courses</p>
                    <p className="text-2xl font-bold text-foreground">{courses.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enrolled Courses Card */}
            <Card className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Enrolled Courses</p>
                    {/* Calculate unique courses using Set */}
                    <p className="text-2xl font-bold text-foreground">
                      {new Set(students.map(s => s.course)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ==================== ADD STUDENT DIALOG ==================== */}
        <div className="mb-6">
          <Dialog 
            open={isAddDialogOpen} 
            onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) resetForm(); // Reset form when dialog closes
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg shadow-md transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Add New Student
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[425px] rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-foreground">
                  Add New Student
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Fill in the student details below to add them to the system.
                </DialogDescription>
              </DialogHeader>
              
              {/* Add Student Form */}
              <form onSubmit={handleAddStudent} className="space-y-4">
                
                {/* Name Input */}
                <div>
                  <Label htmlFor="name" className="text-foreground font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter student's full name"
                    className={`mt-1 rounded-md ${errors.name ? 'border-destructive' : 'border-input'}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter student's email"
                    className={`mt-1 rounded-md ${errors.email ? 'border-destructive' : 'border-input'}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Course Selection */}
                <div>
                  <Label htmlFor="course" className="text-foreground font-medium">
                    Course
                  </Label>
                  <Select 
                    value={formData.course} 
                    onValueChange={(value) => setFormData({ ...formData, course: value })}
                  >
                    <SelectTrigger className={`mt-1 rounded-md w-full ${errors.course ? 'border-destructive' : 'border-input'}`}>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent className="rounded-md shadow-lg">
                      {courses.map((course) => (
                        <SelectItem 
                          key={course.id} 
                          value={course.code} 
                          className="hover:bg-muted cursor-pointer"
                        >
                          {course.name} ({course.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.course && (
                    <p className="text-sm text-destructive mt-1">{errors.course}</p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md transition-all duration-200"
                  >
                    Add Student
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)} 
                    className="flex-1 border-input text-foreground hover:bg-muted rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* ==================== STUDENTS LIST SECTION ==================== */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Students ({students.length})
          </h2>

          {/* Conditional Rendering: Empty State vs Student List */}
          {students.length === 0 ? (
            // Empty State
            <Card className="rounded-xl shadow-lg">
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No students yet</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding your first student to the system.
                </p>
                <Button 
                  onClick={() => setIsAddDialogOpen(true)} 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Student
                </Button>
              </CardContent>
            </Card>
          ) : (
            // Student Cards Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <Card 
                  key={student.id} 
                  className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  <CardHeader className="pb-3">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-foreground">
                        {student.name}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {student.email}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {/* Course Badge */}
                      <div>
                        <Badge variant="secondary" className="bg-secondary/20 text-secondary font-medium px-3 py-1 rounded-full">
                          {getCourseName(student.course)}
                        </Badge>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(student)}
                          className="flex-1 border-border text-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all duration-200"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 border-destructive/50 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* ==================== EDIT STUDENT DIALOG ==================== */}
        <Dialog 
          open={isEditDialogOpen} 
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) resetForm(); // Reset form when dialog closes
          }}
        >
          <DialogContent className="sm:max-w-[425px] rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-foreground">
                Edit Student
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Update the student details below.
              </DialogDescription>
            </DialogHeader>
            
            {/* Edit Student Form */}
            <form onSubmit={handleEditStudent} className="space-y-4">
              
              {/* Name Input */}
              <div>
                <Label htmlFor="edit-name" className="text-foreground font-medium">
                  Full Name
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter student's full name"
                  className={`mt-1 rounded-md ${errors.name ? 'border-destructive' : 'border-input'}`}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <Label htmlFor="edit-email" className="text-foreground font-medium">
                  Email Address
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter student's email"
                  className={`mt-1 rounded-md ${errors.email ? 'border-destructive' : 'border-input'}`}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              {/* Course Selection */}
              <div>
                <Label htmlFor="edit-course" className="text-foreground font-medium">
                  Course
                </Label>
                <Select 
                  value={formData.course} 
                  onValueChange={(value) => setFormData({ ...formData, course: value })}
                >
                  <SelectTrigger className={`mt-1 rounded-md w-full ${errors.course ? 'border-destructive' : 'border-input'}`}>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md shadow-lg">
                    {courses.map((course) => (
                      <SelectItem 
                        key={course.id} 
                        value={course.code} 
                        className="hover:bg-muted cursor-pointer"
                      >
                        {course.name} ({course.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.course && (
                  <p className="text-sm text-destructive mt-1">{errors.course}</p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md transition-all duration-200"
                >
                  Update Student
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)} 
                  className="flex-1 border-input text-foreground hover:bg-muted rounded-lg transition-all duration-200"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Export the component as default export
export default App;