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

        // Transform the answers from Record to QuestionnaireAnswer[]
        const answersArray: QuestionnaireAnswer[] = Object.entries(questionnaire.answers).map(([questionId, answer]) => ({
            questionId: parseInt(questionId),
            answer: answer
        }));

        // Format the answers with question context
        const formattedAnswers: FormattedAnswer[] = answersArray.map(answer => {
            const question = forms.find(q => q.id === answer.questionId);
            const selectedOption = question?.options.find(opt => opt.id === answer.answer);
            return {
                question: question?.question || '',
                answer: selectedOption?.texto || ''
            };
        });

        const systemPrompt = `You are an environmental sustainability expert. Analyze the following questionnaire answers and provide personalized, actionable suggestions for improvement. Focus on practical steps the user can take to become more sustainable. Write in plain text without using any tool calls or markdown formatting.`;
        console.log(JSON.stringify(formattedAnswers));

        const mockedResponse = `Based on your responses, you already demonstrate a good level of environmental awareness and some sustainable habits. To further enhance your positive impact, here are practical, actionable steps you can take:

1. Bring Reusable Bags Regularly: Make it a habit to carry reusable shopping bags whenever you go shopping. Keeping a few in your car, purse, or near your door can make this easier and more automatic.

2. Reuse Containers and Bottles: Start reusing containers and bottles instead of discarding them. This reduces waste and saves resources. Consider investing in a durable water bottle to avoid single-use plastic bottles.

3. Increase Use of Public Transport, Walking, or Biking: Aim to increase your trips using eco-friendly transportation. Even a small increase can significantly reduce your carbon footprint.

4. Unplug Devices Fully: Make it a routine to unplug electronic devices when not in use, rather than leaving them on standby. Using a power strip can make this easier.

5. Use Water and Cleaning Products More Sustainably: Collect rainwater for outdoor use if possible, and choose biodegradable or natural cleaning products more consistently to reduce chemical runoff.

6. Consider Sustainability in Purchases: When buying new appliances or products, check their energy efficiency and sustainability credentials more deliberately. This can lead to long-term energy savings and environmental benefits.

7. Educate Yourself and Others: Seek out information on sustainable practices and share your knowledge with friends and family. This can inspire collective action and reinforce your habits.

8. Participate More Actively in Community Initiatives: Engage in local sustainability projects like community gardens or environmental groups. Your participation can amplify your impact and foster community resilience.

9. Reflect on Your Habits and Values: Even if you feel you could do more, recognizing areas for improvement is a great first step. Small, consistent changes can add up over time.

10. Be Open to Habit Changes: While you may feel hesitant to change habits, understanding the positive impact can motivate you. Even minor adjustments, like reducing meat consumption further or choosing sustainable products, can make a difference.

Remember, sustainability is a journey. Small, consistent actions not only benefit the environment but can also inspire others around you. Your awareness and willingness to consider these steps are already a strong foundation for making a meaningful difference.`

        return mockedResponse;

        const response = await this.generateText(
            JSON.stringify(formattedAnswers),
            systemPrompt
        );
        return response;
    }
}
