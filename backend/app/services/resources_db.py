"""
Curated database of real, high-quality learning resources and hands-on project blueprints
organized by skill and category. All links are authentic, official documentation or top-tier
free learning platforms (Coursera, edX, freeCodeCamp, official docs, Mozilla MDN, etc.).
"""

RESOURCE_CATALOG = {
    # Frontend
    "React": [
        {
            "title": "React Official Documentation & Interactive Tutorials",
            "platform": "React Docs",
            "url": "https://react.dev/learn",
            "type": "documentation",
            "difficulty": "Beginner to Advanced",
            "duration": "15 hours",
            "description": "The official new React docs featuring deep interactive playgrounds, hooks mastery, and state management principles."
        },
        {
            "title": "Full Stack Open: React & Redux Mastery",
            "platform": "University of Helsinki",
            "url": "https://fullstackopen.com/en/",
            "type": "course",
            "difficulty": "Intermediate",
            "duration": "40 hours",
            "description": "Renowned university curriculum covering modern React, hooks, state machines, and end-to-end testing."
        }
    ],
    "TypeScript": [
        {
            "title": "TypeScript for JavaScript Programmers Handbook",
            "platform": "TypeScript Official",
            "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
            "type": "documentation",
            "difficulty": "Intermediate",
            "duration": "10 hours",
            "description": "Comprehensive guide to static typing, interfaces, generics, utility types, and union discrimination."
        },
        {
            "title": "Total TypeScript Tutorials",
            "platform": "TotalTypeScript",
            "url": "https://www.totaltypescript.com/tutorials",
            "type": "tutorial",
            "difficulty": "Intermediate to Advanced",
            "duration": "12 hours",
            "description": "Production-grade TypeScript exercises on complex generics, type narrowing, and API typing."
        }
    ],
    "Next.js": [
        {
            "title": "Next.js App Router Foundations",
            "platform": "Next.js Official Learn",
            "url": "https://nextjs.org/learn",
            "type": "course",
            "difficulty": "Intermediate",
            "duration": "16 hours",
            "description": "Step-by-step masterclass on Server Components, Server Actions, streaming SSR, and SEO optimization."
        }
    ],
    "Vue.js": [
        {
            "title": "Vue 3 Official Interactive Guide",
            "platform": "Vue.js Official",
            "url": "https://vuejs.org/guide/introduction.html",
            "type": "documentation",
            "difficulty": "Beginner to Intermediate",
            "duration": "12 hours",
            "description": "Master Vue 3 Composition API, reactive state primitives, and Vue Router."
        }
    ],

    # Backend
    "Python": [
        {
            "title": "Python 3 Official Tutorial and Standard Library",
            "platform": "Python Software Foundation",
            "url": "https://docs.python.org/3/tutorial/",
            "type": "documentation",
            "difficulty": "Beginner to Intermediate",
            "duration": "20 hours",
            "description": "Exhaustive coverage of Python data structures, decorators, generators, and async programming."
        },
        {
            "title": "CS50's Introduction to Programming with Python",
            "platform": "Harvard University (edX)",
            "url": "https://cs50.harvard.edu/python/",
            "type": "course",
            "difficulty": "Beginner",
            "duration": "35 hours",
            "description": "Harvard's world-class introduction to algorithms, object-oriented design, and testing in Python."
        }
    ],
    "FastAPI": [
        {
            "title": "FastAPI Official Interactive Tutorial - User Guide",
            "platform": "FastAPI Docs",
            "url": "https://fastapi.tiangolo.com/tutorial/",
            "type": "documentation",
            "difficulty": "Intermediate",
            "duration": "14 hours",
            "description": "Learn modern high-performance asynchronous RESTful APIs, Pydantic validation, dependency injection, and OAuth2."
        }
    ],
    "Node.js": [
        {
            "title": "Node.js Complete Guide & Architecture",
            "platform": "Node.js Official",
            "url": "https://nodejs.org/en/learn",
            "type": "documentation",
            "difficulty": "Beginner to Intermediate",
            "duration": "18 hours",
            "description": "Understand event loops, asynchronous streams, buffer manipulation, and microservices architecture."
        }
    ],
    "Go": [
        {
            "title": "A Tour of Go and Go by Example",
            "platform": "The Go Programming Language",
            "url": "https://go.dev/tour/welcome/1",
            "type": "tutorial",
            "difficulty": "Intermediate",
            "duration": "15 hours",
            "description": "Master Goroutines, channels, interfaces, pointers, and memory-efficient backend service creation."
        }
    ],

    # Database
    "PostgreSQL": [
        {
            "title": "PostgreSQL Official Documentation and SQL Mastery",
            "platform": "PostgreSQL Global Development Group",
            "url": "https://www.postgresql.org/docs/current/tutorial.html",
            "type": "documentation",
            "difficulty": "Intermediate",
            "duration": "15 hours",
            "description": "Deep dive into ACID transactions, indexing strategies (B-Tree, GIN, GiST), JSONB, and query optimization."
        },
        {
            "title": "Database Design and Relational SQL Modeling",
            "platform": "freeCodeCamp",
            "url": "https://www.freecodecamp.org/news/relational-database-course/",
            "type": "course",
            "difficulty": "Intermediate",
            "duration": "25 hours",
            "description": "Hands-on projects covering schema normalization, foreign key constraints, and performance tuning."
        }
    ],
    "MongoDB": [
        {
            "title": "MongoDB University: NoSQL Data Modeling",
            "platform": "MongoDB University",
            "url": "https://learn.mongodb.com/",
            "type": "course",
            "difficulty": "Beginner to Intermediate",
            "duration": "14 hours",
            "description": "Document schema design, aggregation pipelines, replica sets, and horizontal sharding."
        }
    ],
    "Redis": [
        {
            "title": "Redis University: In-Memory Data Structures & Caching",
            "platform": "Redis University",
            "url": "https://university.redis.com/",
            "type": "course",
            "difficulty": "Intermediate",
            "duration": "10 hours",
            "description": "Learn caching strategies, distributed locks, Pub/Sub channels, and rate-limiting patterns."
        }
    ],

    # Cloud & DevOps
    "Docker": [
        {
            "title": "Docker Official Getting Started & Best Practices",
            "platform": "Docker Docs",
            "url": "https://docs.docker.com/get-started/",
            "type": "documentation",
            "difficulty": "Beginner to Intermediate",
            "duration": "10 hours",
            "description": "Build multi-stage Dockerfiles, minimize container footprint, and manage multi-container apps with Compose."
        }
    ],
    "Kubernetes": [
        {
            "title": "Kubernetes Official Interactive Basics",
            "platform": "Kubernetes.io",
            "url": "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
            "type": "tutorial",
            "difficulty": "Advanced",
            "duration": "20 hours",
            "description": "Deploy scalable applications, configure ingress controllers, persistent volumes, and self-healing clusters."
        }
    ],
    "AWS": [
        {
            "title": "AWS Cloud Practitioner & Solutions Architecture Essentials",
            "platform": "AWS Skill Builder",
            "url": "https://explore.skillbuilder.aws/",
            "type": "course",
            "difficulty": "Beginner to Intermediate",
            "duration": "25 hours",
            "description": "Official Amazon training on EC2, S3, RDS, Lambda, IAM policies, and VPC architecture."
        }
    ],

    # AI & Machine Learning
    "Machine Learning": [
        {
            "title": "Machine Learning Specialization",
            "platform": "DeepLearning.AI / Coursera (Andrew Ng)",
            "url": "https://www.coursera.org/specializations/machine-learning-introduction",
            "type": "course",
            "difficulty": "Beginner to Intermediate",
            "duration": "60 hours",
            "description": "Foundational course on linear regression, logistic classification, neural networks, decision trees, and unsupervised learning."
        },
        {
            "title": "Scikit-Learn User Guide & Machine Learning Benchmarks",
            "platform": "Scikit-Learn Docs",
            "url": "https://scikit-learn.org/stable/user_guide.html",
            "type": "documentation",
            "difficulty": "Intermediate",
            "duration": "20 hours",
            "description": "Feature scaling, cross-validation, hyperparameter grid search, ensemble models, and evaluation metrics."
        }
    ],
    "Deep Learning": [
        {
            "title": "Deep Learning Specialization with PyTorch & TensorFlow",
            "platform": "DeepLearning.AI",
            "url": "https://www.deeplearning.ai/courses/deep-learning-specialization/",
            "type": "course",
            "difficulty": "Intermediate to Advanced",
            "duration": "50 hours",
            "description": "CNNs, sequence models, Transformers, attention mechanisms, backpropagation optimization, and regularization."
        }
    ],
    "Natural Language Processing": [
        {
            "title": "Hugging Face NLP Course: Transformers, Tokenizers & Fine-Tuning",
            "platform": "Hugging Face",
            "url": "https://huggingface.co/learn/nlp-course/",
            "type": "course",
            "difficulty": "Intermediate to Advanced",
            "duration": "30 hours",
            "description": "Hands-on guide to modern transformer models (BERT, GPT, T5), sentence embeddings, and fine-tuning pipelines."
        }
    ],
    "Data Science": [
        {
            "title": "Python for Data Analysis & Pandas Mastery",
            "platform": "Wes McKinney / O'Reilly",
            "url": "https://wesmckinney.com/book/",
            "type": "documentation",
            "difficulty": "Intermediate",
            "duration": "20 hours",
            "description": "Manipulate structured data, perform exploratory data analysis (EDA), and execute vectorized operations with Pandas."
        }
    ]
}

# Project blueprints designed to prove missing skills
PROJECT_BLUEPRINTS = {
    "React": {
        "title": "Collaborative Real-Time Workspace Dashboard",
        "difficulty": "Intermediate",
        "tech_stack": ["React", "TypeScript", "Tailwind CSS", "WebSockets"],
        "overview": "Build a responsive Kanban-style project dashboard with live multi-user updates, optimistic UI states, and custom drag-and-drop components.",
        "key_features": [
            "Drag-and-drop task column management with smooth animations",
            "Live multi-user status sync via WebSockets",
            "Accessible modal forms with form validation and debounce",
            "Dark/Light theme toggle with CSS custom properties"
        ],
        "learning_outcomes": ["State management patterns", "React Hooks (useMemo, useCallback, useRef)", "Component lifecycle and rendering optimization"]
    },
    "TypeScript": {
        "title": "Type-Safe Enterprise API Client & State Store",
        "difficulty": "Intermediate",
        "tech_stack": ["TypeScript", "Zod", "React"],
        "overview": "Develop an end-to-end type-safe client library that validates runtime payloads using Zod schemas and provides compile-time inference.",
        "key_features": [
            "Generics-based HTTP request builder with retry backoff",
            "Zod schema runtime validation with user-friendly error formatting",
            "Discriminated union states for loading, error, and success views"
        ],
        "learning_outcomes": ["Advanced Generics", "Type narrowing and guards", "Runtime vs compile-time guarantees"]
    },
    "FastAPI": {
        "title": "High-Throughput Asynchronous Document Analysis Microservice",
        "difficulty": "Intermediate",
        "tech_stack": ["FastAPI", "Python", "SQLAlchemy", "Pydantic", "Docker"],
        "overview": "Construct an asynchronous microservice with streaming file uploads, background tasks for document parsing, and JWT bearer authentication.",
        "key_features": [
            "Asynchronous endpoints handling concurrent file processing",
            "Dependency injection for database sessions and authentication",
            "OpenAPI / Swagger auto-generated documentation with schema validation",
            "Pytest unit and integration test suite with SQLite in-memory test runner"
        ],
        "learning_outcomes": ["Asyncio in Python", "Modern REST API design", "Dependency injection architectures"]
    },
    "PostgreSQL": {
        "title": "Scalable Multi-Tenant E-Commerce Database Architecture",
        "difficulty": "Intermediate",
        "tech_stack": ["PostgreSQL", "SQLAlchemy", "Alembic", "SQL"],
        "overview": "Design an enterprise database schema handling high transaction volume, relational integrity, and search indexing.",
        "key_features": [
            "Optimized B-tree and GIN indexes for sub-millisecond query execution",
            "Foreign key cascading and database trigger audits for tracking inventory changes",
            "Full-text search using tsvector and tsquery for catalog items"
        ],
        "learning_outcomes": ["Database normalization (3NF)", "Query execution plans (EXPLAIN ANALYZE)", "Data consistency and transaction isolation"]
    },
    "Docker": {
        "title": "Production-Ready Multi-Stage Container Pipeline",
        "difficulty": "Intermediate",
        "tech_stack": ["Docker", "Docker Compose", "Nginx", "FastAPI"],
        "overview": "Containerize a full-stack web application using multi-stage builds to reduce image size by over 80% while establishing an isolated dev network.",
        "key_features": [
            "Multi-stage Dockerfile separating build dependencies from runtime alpine environment",
            "Docker Compose orchestration for frontend, backend API, PostgreSQL, and Redis",
            "Healthcheck commands and graceful process termination signals"
        ],
        "learning_outcomes": ["Container security practices", "Layer caching optimization", "Networking between services"]
    },
    "Machine Learning": {
        "title": "Automated End-to-End Predictive Lead Scoring Engine",
        "difficulty": "Advanced",
        "tech_stack": ["Python", "Scikit-Learn", "Pandas", "NumPy", "FastAPI"],
        "overview": "Build a supervised machine learning pipeline from raw dataset ingestion, exploratory analysis, feature engineering, model training, to serving predictions via REST API.",
        "key_features": [
            "Pipeline for handling missing values, one-hot encoding, and standard scaling",
            "Cross-validated comparison of Random Forest, Gradient Boosting, and Logistic Regression",
            "SHAP or permutation feature importance interpretability report",
            "Production prediction endpoint returning score and top contributing factors"
        ],
        "learning_outcomes": ["Model evaluation (ROC-AUC, Precision-Recall)", "Feature engineering pipelines", "Model serialization and serving"]
    },
    "Natural Language Processing": {
        "title": "Semantic Document Search & Matching Engine",
        "difficulty": "Advanced",
        "tech_stack": ["Python", "TF-IDF / Sentence Transformers", "Scikit-Learn", "FastAPI"],
        "overview": "Develop a semantic search engine that indexes technical text, tokenizes key domains, and computes vector similarity to return ranked matches.",
        "key_features": [
            "Custom NLP tokenizer with domain-specific stopword filtering and lemmatization",
            "TF-IDF n-gram vectorization with cosine similarity scoring",
            "Transparent scoring explainability breakdown detailing matched vs missing criteria"
        ],
        "learning_outcomes": ["Vector space modeling", "Text preprocessing pipelines", "Information retrieval metrics"]
    }
}

DEFAULT_FALLBACK_RESOURCES = [
    {
        "title": "freeCodeCamp Full Stack Developer Curriculum",
        "platform": "freeCodeCamp",
        "url": "https://www.freecodecamp.org/learn",
        "type": "course",
        "difficulty": "Beginner to Intermediate",
        "duration": "100+ hours",
        "description": "Comprehensive, hands-on, project-driven software development certification curriculum."
    },
    {
        "title": "Developer Roadmaps & Guides",
        "platform": "roadmap.sh",
        "url": "https://roadmap.sh/",
        "type": "documentation",
        "difficulty": "All Levels",
        "duration": "Self-paced",
        "description": "Community-driven visual roadmaps and study guides for Frontend, Backend, DevOps, and AI engineering."
    }
]

def get_resources_for_skill(skill_name: str) -> list:
    """Retrieve curated resources matching skill, with fallback to category or default."""
    skill_lower = skill_name.lower().strip()
    for catalog_skill, resources in RESOURCE_CATALOG.items():
        if catalog_skill.lower() == skill_lower or catalog_skill.lower() in skill_lower or skill_lower in catalog_skill.lower():
            return resources
    return DEFAULT_FALLBACK_RESOURCES

def get_project_for_skills(missing_skills: list) -> list:
    """Select appropriate project blueprints based on the user's missing skills."""
    selected_projects = []
    seen_titles = set()

    for skill in missing_skills:
        skill_lower = skill.lower().strip()
        for blueprint_skill, blueprint in PROJECT_BLUEPRINTS.items():
            if (blueprint_skill.lower() in skill_lower or skill_lower in blueprint_skill.lower()) and blueprint["title"] not in seen_titles:
                selected_projects.append(blueprint)
                seen_titles.add(blueprint["title"])
                break

    # If no specific match, provide a high-value full-stack / API project
    if not selected_projects:
        selected_projects.append(PROJECT_BLUEPRINTS["FastAPI"])
        selected_projects.append(PROJECT_BLUEPRINTS["React"])

    return selected_projects[:3]
