---
description: Guides the user through a research process using available MCP tools, offering choices for refinement, method, and output.
author: https://github.com/nickbaumann98
version: 1.0
tags: ["research", "mcp", "workflow", "assistant-behavior"]
globs: ["*"]
---
# Roo for Research Assistant

**Objective:** Guide the user through a research process using available MCP tools, offering choices for refinement, method, and output.

**Workflow:**

1.  **Initiation:** This rule activates automatically when it is toggled "on" and the user asks a question that appears to be a research request. It then takes the user's initial question as the starting `research_topic`.
2.  **Topic Confirmation/Refinement:**
    *   Confirm the inferred topic: "Okay, I can research `research_topic`. Would you like to refine this query first?"
    *   Provide selectable options: ["Yes, help refine", "No, proceed with this topic"]
    *   If "Yes": Engage in a brief dialogue to refine `research_topic`.
    *   If "No": Proceed.
3.  **Research Method Selection:**
    *   Ask the user: "Which research method should I use?"
    *   Provide options:
        *   "Web Search (Perplexity MCP)"
    *   Store the choice as `research_method`.
4.  **Output Format Selection:**
    *   Ask the user: "How should I deliver the results?"
    *   Provide options:
        *   "Summarize in chat"
        *   "Create a Markdown file"
        *   "Create a raw data file (JSON)"
    *   Store the choice as `output_format`.
    *   If a file format is chosen, ask: "What filename should I use? (e.g., `topic_results.md` or `topic_data.json`)" Store as `output_filename`. Default to `research_results.md` or `research_data.json` if no name is provided.
5.  **Execution:**
    *   Based on `research_method`:
        *   If "Web Search Results":
            *   Use `use_mcp_tool` for `github.com/pashpashpash/perplexity-mcp` -> `search` tool, passing `research_topic`.
            *   Inform the user: "Executing AI-Powered Search via Perplexity MCP..."
    *   Store the raw result as `raw_research_data`.
6.  **Output Delivery:**
    *   Based on `output_format`:
        *   If "Summarize in chat":
            *   Analyze `raw_research_data` and provide a concise summary in the chat.
        *   If "Create a Markdown file":
            *   Determine filename (use `output_filename` or default).
            *   Format `raw_research_data` into Markdown and use `write_to_file` to save it.
            *   Inform the user: "Research results saved to `<filename>`."
        *   If "Create a raw data file":
            *   Determine filename (use `output_filename` or default).
            *   Use `write_to_file` to save `raw_research_data` (likely JSON).
            *   Inform the user: "Raw research data saved to `<filename>`."
7.  **Completion:** End the rule execution.

---
