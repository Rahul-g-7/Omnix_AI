import { getModel } from "../config/llmModels.js";

export const codingAgent = async (state) => {
  const intentllm = await getModel("intent");
  const llm = await getModel("coding");
  const intentRes = await intentllm.invoke(`
        Your are an intent classifier.

        Return ONLY one owrd of these values.

        CODE_GENERATION
        CODE_REVIEW
        CODE_EXPLANATION
        DEBUGGING
        OPTIMIZATION
        CONVERSATION
        DOCUMENTATION

        User Request:
        ${state.prompt}
        `);
  const intent = intentRes.content;
  if (intent == "CODE_GENERATION") {
    const prompt = `You are Senior software engineer .
            generate the requested project.
            Define stack:
            -HTML
            -CSS
            -JavaScript

            use React/ Next.js / Vue ONLY if explicitly requested.

            Rules:

            -Responsive
            -Modern UI 
            -CSS Variables
            -Flexbox/Grid
            -Smooth Scroll
            -Hover Effects
            -Beautiful spacing
            -Single page unless the user asks otherWise.

            Return ONLY vaalid JSON.

            Schema:{
            "files":[
            {
            "name":"index.html,
            "content":"..."
            },
            {
            "name":"style.css,
            "content":"..."
            },
            {
            "name":"script.js,
            "content":"..."
            },
            ]
            }

            Rules:

            -output must start with {
            -output must end with }
            -No markdown
            -No explaination 
            -No extra text
            -No \`\`\`
            -never mention intent

            User Request:
            ${state.prompt}
            `;

    const res = await llm.invoke(prompt);
    const data = JSON.parse(res.content);
    return {
      ...state,
      aiResponse: "Code Generated Succesfully.",
      artifacts: [
        {
          id: Date.now(),
          type: "Project",
          files: data.files || [],
          title:state.prompt
        },
      ],
    };
  }
  const res = await llm.invoke(`
    ${intent}
    Return Markdown only.

    Never generate project files.

    use heaadings like:
    # overview
    ## Explaination
    # problems
    ## Improvemts 
    ## best Practices 
    ## optimized code (if needed)

    user Request:
    ${state.prompt}
    
    `);
  const data = res.content;
  return {
    ...state,
    aiResponse: data,
    artifacts: [],
  };
};
