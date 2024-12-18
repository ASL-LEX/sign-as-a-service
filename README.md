## Sign as a Service

### About

Sign as a Service is an in-development platform designed to provide digital representations of signs, enabling researchers to label videos of sign data with precise sign language entries rather than written language translations. Traditionally, users would watch a video of a person signing and enter a written translation that best matched the sign. This approach often led to inaccuracies and ambiguities due to differences in how signs are represented in various languages. For instance, the sign for "cat" has multiple unique forms in ASL (American Sign Language).

With Sign as a Service, users can search through a comprehensive sign language lexicon and select the exact sign they intend to label. Each sign has a unique code, ensuring a 1-to-1 labeling process.

### Accessing the Sign as a Service Web Interface

- **Early-Stage Demo:** Currently accessible at [lex-demo.sail.codes](https://lex-demo.sail.codes/).
- **Administrator Portal:** Researchers can manage lexicons through an admin portal at [ADMIN PORTAL PLACEHOLDER]() (link to be updated).

### Architecture

Sign as a Service is developed using TypeScript and Python, with all components organized in the `packages` directory.

#### Frontend

The platform includes three frontend packages built with React:

- **`admin_view`**: An administrator portal allowing researchers to manage the database and perform CRUD operations.
- **`demo`**: An early-stage demo showcasing the platform's capabilities.
- **`view`**: A small component library for integrating Sign as a Service functionality into existing React applications. Components from this package are used in the other frontend packages.

#### Backend

The backend consists of a service-oriented GraphQL API built with NestJS and Apollo. Currently, only the `lex_service` package has been deployed as a standalone API.

Backend Services:

- **`gateway`**: The main API entry point built with NestJS.
- **`lex_service`**: A NestJS GraphQL API enabling interactions with the database, including CRUD operations and search functionality. This service powers all three frontend packages.
- **`lex_cli`**: A NodeJS command-line interface for batch uploading new sign data.
- **`model`**: A prototype computer vision model built with PyTorch, designed to classify sign videos, allowing video-based searches.
- **`model_service`**: A GraphQL API built with FastAPI that interacts with the computer vision model.

#### Storage

- **Database:** MongoDB serves as the primary database.
- **Video Storage:** AWS S3 is used for storing video content.

### Custom Development

#### Starting the Project Locally

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ASL-LEX/sign-as-a-service.git
   cd sign-as-a-service
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Start the Backend:**
   - Add a `.env` file in `packages/lex_service` based on `.env.sample`.
   - Ensure you have Google Cloud Platform credentials, as `lex_service` uses GCP Identities for authentication.
   - Start a local MongoDB instance using Docker:
     ```bash
     docker run -d --name saas-mongo -p 27017:27017 -v saas-mongo-data:/data/db mongo
     ```
   - Start the backend:
     ```bash
     npm run start:dev
     ```
4. **Start the Frontend:**
   - Choose the desired frontend package (`admin_view`, `demo`, or `view`).
   - For `admin_view` and `demo`, add a `.env` file based on `.env.sample` within the selected package.
   - The `view` package does not require a `.env` file, as its components will use the Apollo Client from the application in which they are used. If you would like to develop `view` locally, update the `schema` field in the `graphql-codegen.yml` file to point to the URI of the local backend.
   - Start the frontend:
     ```bash
     npm run dev
     ```

### Contributing

We welcome contributions to Sign as a Service. To get involved:

- **Issues:**

  - Check existing issues before opening a new one.
  - Provide clear and descriptive information when reporting bugs or suggesting features.

- **Pull Requests:**
  - Fork the repository and create a feature branch.
  - Follow coding standards and ensure proper testing.
  - Submit a pull request with a clear description of changes.

By contributing, you help improve the platform and advance sign language research. Thank you for supporting Sign as a Service!

### Deployment
Deployment is hosted on an OpenStack virtual machine in the New England Research Cloud (NERC). A Portainer instance facilitates the management of Docker containers comprising the deployment. Updates to the deployment are seamlessly automated via GitHub Actions.
