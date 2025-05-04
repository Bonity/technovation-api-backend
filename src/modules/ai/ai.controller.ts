import { Body, Controller, Post } from "@nestjs/common";
import { AiService } from "./ai.service";
import { Message } from "ai";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("generate-text")
  async generateText(@Body() body: { text: string }) {
    const systemPrompt = "You are a helpful assistant that can answer questions and help with tasks.";
    return this.aiService.generateText(body.text, systemPrompt);
  }

  @Post("generate-chat-message")
  async generateChatMessage(@Body() body: { messages: Message[] }) {
    const systemPrompt = "You are a helpful sustainability assistant that can answer questions regarding environmental issues and help with tasks. Talk like a pirate.";
    const answer = await this.aiService.generateChatMessage(body.messages, systemPrompt); 
    return {
      answer: answer
    }
  }

  @Post("generate-questionnaire-text-response")
  async generateQuestionnaireTextResponse(@Body() body: { questionnaireID: number }) {
    const answer = await this.aiService.GenerateQuestionnaireTextResponse(body.questionnaireID);
    return {
      answer: answer
    }
  }

}
