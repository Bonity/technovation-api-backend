import { openai } from "@ai-sdk/openai";
import { Injectable } from "@nestjs/common";
import { generateText, Message } from "ai";
import { QuestionnaireService } from "../questionnaire/questionnaire.service";
import * as forms from './forms.json';

interface QuestionnaireAnswer {
    questionId: number;
    answer: string;
}

interface FormattedAnswer {
    question: string;
    answer: string;
}

@Injectable()
export class AiService {
    constructor(private readonly questionnaireService: QuestionnaireService) {}

    async generateText(text: string, systemPrompt: string): Promise<string> {
        const response = await generateText({
            model: openai("gpt-4.1-nano"),
            prompt: text,
            system: systemPrompt,
        });
        return response.text;
    }

    async generateChatMessage(messages: Message[], systemPrompt: string): Promise<string> {
        const response = await generateText({
            model: openai("gpt-4.1-nano"),
            messages: messages,
            system: systemPrompt,
        });
        return response.text;
    }
    async GenerateQuestionnaireTextResponse(questionnaireID: number): Promise<string> {
        const questionnaire = await this.questionnaireService.findOne(questionnaireID);
        if (!questionnaire) {
            throw new Error('Questionnaire not found');
        }

        const answersArray: QuestionnaireAnswer[] = Object.entries(questionnaire.answers).map(([questionId, answer]) => ({
            questionId: parseInt(questionId),
            answer: answer
        }));

        const formattedAnswers: FormattedAnswer[] = answersArray.map(answer => {
            const question = forms.find(q => q.id === answer.questionId);
            const selectedOption = question?.options.find(opt => opt.id === answer.answer);
            return {
                question: question?.question || '',
                answer: selectedOption?.texto || ''
            };
        });

        const systemPrompt = `You are an environmental sustainability expert. Analyze the following questionnaire answers and provide personalized, actionable suggestions for improvement. Focus on practical steps the user can take to become more sustainable. Write in plain text without using any tool calls or markdown formatting. Do not use bullet points. Consider the answers as a whole and give a comprehensive answer. Limit your answer to 200 words.`;
        console.log(JSON.stringify(formattedAnswers));

        
        const response = await this.generateText(
            JSON.stringify(formattedAnswers),
            systemPrompt
        );
        return response;
    }
}
