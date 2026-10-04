import { checkAgentLimit } from "../config/agentLimit.js";
import { getModel } from "../config/llmModels.js";
import { deductCredits } from "../utils/deductCredits.js";

export const codingAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId,"coding");
    await deductCredits(state.userId, "coding");
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

    const intent = intentRes.content?.trim();

    if (intent === "CODE_GENERATION") {
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

            Images: 
            - If the project needs images, use real images from Unsplash. 
            - Use direct Unsplash image URLs from images.unsplash.com. 
            - Choose images relevant to the user's request. 
            - Do not use fake, broken, placeholder, or invented image URLs. 
            - If images are not needed, do not add them.
      

            Return ONLY vaalid JSON.

            Schema:{
            "files":[
            {
            "name":"index.html",
            "content":"..."
            },
            {
            "name":"style.css",
            "content":"..."
            },
            {
            "name":"script.js",
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
      
      console.log(res.content);
      let content = res.content.trim();

      // Remove markdown code fences if the model adds them
      content = content.replace(/^```json\s*/i, "");
      content = content.replace(/^```\s*/i, "");
      content = content.replace(/\s*```$/i, "");

      let data;
      try {
        data = JSON.parse(content);
      } catch (parseError) {
        console.error(
          "Failed to parse JSON response from coding agent:",
          parseError,
        );
        // Fallback: Attempt to extract JSON substring if extra text was included
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          data = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Model response was not valid JSON.");
        }
      }

      return {
        ...state,
        aiResponse: "Code Generated Succesfully.",
        artifacts: [
          {
            id: Date.now(),
            type: "Project",
            files: data?.files || [],
            title: state.prompt,
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
  } catch (error) {
    console.error("Error in codingAgent:", error);
    return {
      ...state,
      aiResponse: error?.data?.message || "Failed  to generate code",
      artifacts: [],
    };
  }
};
