import { useState } from "react";

interface CodeTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  tags: string[];
}

interface CodeTemplatesProps {
  onSelectTemplate: (template: CodeTemplate) => void;
  onClose: () => void;
}

const codeTemplates: CodeTemplate[] = [
  {
    id: "react-component",
    title: "React Component",
    description: "Create a reusable React component with TypeScript",
    prompt:
      "Create a React component with TypeScript that includes props interface, proper typing, and modern React patterns. Include examples of usage and styling with Tailwind CSS.",
    category: "Frontend",
    tags: ["React", "TypeScript", "Component"],
  },
  {
    id: "rest-api",
    title: "REST API",
    description: "Build a complete REST API with Express.js",
    prompt:
      "Create a REST API using Express.js and TypeScript with CRUD operations, middleware for authentication, error handling, input validation, and proper HTTP status codes. Include database integration with Prisma or Mongoose.",
    category: "Backend",
    tags: ["Express", "API", "TypeScript"],
  },
  {
    id: "database-schema",
    title: "Database Schema",
    description: "Design a database schema with relationships",
    prompt:
      "Design a database schema with proper relationships, indexes, and constraints. Include both SQL DDL statements and an ORM model definition. Consider data normalization and performance optimization.",
    category: "Database",
    tags: ["SQL", "Schema", "Database"],
  },
  {
    id: "auth-system",
    title: "Authentication System",
    description: "Complete authentication with JWT",
    prompt:
      "Create a complete authentication system with user registration, login, JWT tokens, password hashing, email verification, and password reset functionality. Include both backend API and frontend integration.",
    category: "Security",
    tags: ["Auth", "JWT", "Security"],
  },
  {
    id: "docker-setup",
    title: "Docker Configuration",
    description: "Dockerize an application with multi-stage builds",
    prompt:
      "Create Docker configuration for a full-stack application including Dockerfile with multi-stage builds, docker-compose.yml for development and production, environment variable handling, and optimization for smaller image sizes.",
    category: "DevOps",
    tags: ["Docker", "DevOps", "Deployment"],
  },
  {
    id: "testing-suite",
    title: "Testing Suite",
    description: "Comprehensive testing setup with Jest and Testing Library",
    prompt:
      "Set up a comprehensive testing suite with unit tests, integration tests, and end-to-end tests. Include Jest configuration, React Testing Library setup, mock implementations, and test coverage reporting.",
    category: "Testing",
    tags: ["Jest", "Testing", "Quality"],
  },
];

const categories = [
  "All",
  "Frontend",
  "Backend",
  "Database",
  "Security",
  "DevOps",
  "Testing",
];

export default function CodeTemplates({
  onSelectTemplate,
  onClose,
}: CodeTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTemplates = codeTemplates.filter((template) => {
    const matchesCategory =
      selectedCategory === "All" || template.category === selectedCategory;
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white border-b p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Code Templates</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{template.title}</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {template.category}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{template.description}</p>
            <div className="flex flex-wrap gap-1">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No templates found matching your criteria.
        </div>
      )}
    </div>
  );
}
