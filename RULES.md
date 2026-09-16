# Operational Rules & Agent Guidelines

All agents and subagents working on this repository MUST strictly follow the operational protocol defined below.

---

## 1. Task Decomposition & Verification (`TASKS.md`)
- **Decompose First**: Before executing any complex task or feature, break it down into small, modular, and manageable subtasks.
- **Maintain `TASKS.md`**: Record all tasks, their statuses (`[ ] Pending`, `[-] In Progress`, `[x] Completed`), dependencies, and acceptance criteria in [`TASKS.md`](file:///F:/Project/SolOptimizer/TASKS.md).
- **Strict Verification**: A task can only be marked as completed (`[x]`) after its functionality and correctness are verified through tests, builds, or explicit output validation.

---

## 2. Parallel Execution & Subagent Tracking (`TRACK.md`)
- **Parallelize via Subagents**: Identify independent tasks that can be executed concurrently and spin up specialized subagents.
- **Track in `TRACK.md`**: Maintain an active log in [`TRACK.md`](file:///F:/Project/SolOptimizer/TRACK.md) documenting:
  - Subagent conversation ID and assigned task/role.
  - Current status (`Running`, `Completed`, `Failed`).
  - Inputs, deliverables, and handoff results.
- **Consolidation**: The primary agent must review and merge subagent outputs, ensuring no merge conflicts or duplicate work.

---

## 3. Context Maintenance (`CONTEXT.md`)
- **Maintain Living Architecture & State**: Continuously update [`CONTEXT.md`](file:///F:/Project/SolOptimizer/CONTEXT.md) with:
  - Current codebase structure and key file descriptions.
  - High-level architectural decisions and tech stack notes.
  - Active project state, active integrations, and environment details.
- **Zero Context Loss**: Every session or subagent must read [`CONTEXT.md`](file:///F:/Project/SolOptimizer/CONTEXT.md) before starting work to prevent hallucinations and loss of project direction.

---

## 4. Scope Adherence & Anti-Over-Engineering
- **Stay Within Scope**: Strictly implement what is requested in the task/PRD. Do not introduce unrequested features, speculative abstractions, or unnecessary third-party dependencies.
- **Keep It Simple (KISS & YAGNI)**: Favor simple, readable, and direct implementations over complex frameworks or convoluted design patterns.
- **Refactor Only When Necessary**: Do not rewrite working modules unless explicitly required for the current task.

---

## 5. Version Control: Commit & Push Changes
- **Frequent Commits**: Commit atomic, logical changes after verifying individual tasks.
- **Push to Remote**: Always push changes to the active branch upon task verification.
- **Conventional Commit Messages**: Use clear, structured commit messages (e.g., `feat: ...`, `fix: ...`, `docs: ...`, `test: ...`).

---

## 6. Strict Adherence to `RULES.md`
- **Mandatory Compliance**: These rules are binding across all agents, subagents, and automated workflows.
- **Pre-flight & Post-flight Checks**: Verify compliance with these rules before initiating tasks and prior to concluding interactions.
