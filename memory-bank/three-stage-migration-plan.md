### Three-Stage Database Migration Plan: TursoDB to NeonDB

This plan outlines the steps and commands required to migrate your database from TursoDB to NeonDB in a three-stage process. This approach is designed to be more robust and provide greater control over each step of the migration.

---

### Prerequisites

Before you begin, please ensure you have the following command-line tools installed:

*   **Turso CLI:** For interacting with your TursoDB. If you don't have it, you can install it by following the instructions at [https://docs.turso.tech/cli/installation/](https://docs.turso.tech/cli/installation/).
*   **SQLite:** The `sqlite3` command-line tool. This is typically pre-installed on most systems.
*   **pgloader:** A powerful data loading tool for PostgreSQL. You can find installation instructions at [https://pgloader.io/](https://pgloader.io/).
*   **PostgreSQL Client Tools:** `pg_dump` and `psql`. These are included with a standard PostgreSQL installation.

---

### Stage 1: Dump Remote TursoDB to a Local SQLite File

In this stage, we will export the schema and data from your remote TursoDB to a local SQL file.

**Command:**

```bash
turso db shell <your-database-name> .dump > turso_dump.sql
```

*   **Action:** This command will connect to your TursoDB instance and create a SQL dump file named `turso_dump.sql` in your current directory.
*   **Note:** Please replace `<your-database-name>` with the actual name of your TursoDB database.

---

### Stage 2: Convert the SQLite File to a Local PostgreSQL Database

Next, we will use the `pgloader` tool to convert the SQLite dump file into a local PostgreSQL database. This step is necessary because SQLite and PostgreSQL have different SQL dialects.

**Commands:**

1.  **Create a temporary SQLite database from the dump:**

    ```bash
    sqlite3 temp_local.db < turso_dump.sql
    ```

    *   **Action:** This command will create a temporary local SQLite database file named `temp_local.db` and import the schema and data from the `turso_dump.sql` file.

2.  **Migrate the data to your local PostgreSQL database:**

    ```bash
    pgloader sqlite://./temp_local.db postgresql://<your-username>:<your-password>@localhost/<your-local-db-name>
    ```

    *   **Action:** This command will connect to your local SQLite database and migrate the data to your local PostgreSQL database.
    *   **Note:** Please replace `<your-username>`, `<your-password>`, and `<your-local-db-name>` with your actual local PostgreSQL credentials and database name.

---

### Stage 3: Push the Local PostgreSQL Database to NeonDB

Finally, we will create a dump of the local PostgreSQL database and restore it to your remote NeonDB instance.

**Commands:**

1.  **Create a dump of your local PostgreSQL database:**

    ```bash
    pg_dump -Fc -U <your-username> <your-local-db-name> > neon_dump.dump
    ```

    *   **Action:** This command will create a custom-format dump file named `neon_dump.dump` of your local PostgreSQL database.
    *   **Note:** Please replace `<your-username>` and `<your-local-db-name>` with your local PostgreSQL credentials and database name.

2.  **Restore the dump to your NeonDB instance:**

    ```bash
    pg_restore -h <neon-host> -U <neon-user> -d <neon-db-name> -W neon_dump.dump
    ```

    *   **Action:** This command will restore the data from the `neon_dump.dump` file to your NeonDB instance.
    *   **Note:** Please replace `<neon-host>`, `<neon-user>`, and `<neon-db-name>` with your actual NeonDB connection details. You will be prompted for your NeonDB password.