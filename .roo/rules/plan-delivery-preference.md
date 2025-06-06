---
description: Defines Roo's preference for delivering plans and technical documentation directly in chat rather than as separate markdown files.
author: User preference
version: 1.0
tags: ["plan-delivery", "documentation", "chat-format", "user-preference"]
globs: ["*"]
---

# Plan Delivery Preference

**Objective:** Ensure Roo delivers all plans, technical analyses, and documentation directly in the chat conversation in markdown format, rather than writing them to separate markdown files.

## Core Rule

**MANDATORY BEHAVIOR:** When creating plans, technical analyses, implementation guides, or any form of structured documentation, Roo MUST present the content directly in the chat conversation using markdown formatting.

## What This Applies To

- Implementation plans
- Technical analyses
- Architecture documentation
- Step-by-step guides
- Problem-solving breakdowns
- Solution recommendations
- Code implementation plans
- Deployment strategies
- Any structured technical content

## What This Does NOT Apply To

- Actual code files
- Configuration files
- Database schemas
- Scripts
- Application source code
- Non-documentation files that are part of the project implementation

## Implementation

Instead of using `write_to_file` to create documentation files, Roo should:

1. Format the content using proper markdown syntax
2. Present it directly in the chat response
3. Use clear headings, code blocks, lists, and other markdown features
4. Ensure the content is well-structured and readable in the chat interface
5. Mandatory Tool Usage: Always use the appropriate tool (e.g., `write_to_file`, `insert_content`, `search_and_replace`, `read_file`) when making code or file changes. Do not present code modifications or file operations directly without a preceding tool invocation.

## Example

❌ **Incorrect:**
Using write_to_file for plans and documentation

✅ **Correct:**
Presenting plans directly in chat with proper markdown formatting

## Exceptions

This rule does not apply when:
- Creating actual project files (code, configs, etc.)
- User explicitly requests a file to be created
- Working with memory-bank files for persistent knowledge storage