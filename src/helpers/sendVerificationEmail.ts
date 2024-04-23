import {resend} from '@/lib/resend';
import VerificationEmail from '../../emailTemplates/verificationEmail';
import { ApiResponse } from '@/types/apiResponse';

export async function sendVerificationEmail(
            email: string,
            username: string,
            verifyCode: string,
        ): Promise<ApiResponse> {
            try {
                resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: email,
                    subject: 'Mstry - Verify your email',
                    react: VerificationEmail({username, otp:verifyCode})
                  });
                return {
                    success: true,
                    message: 'Verification email sent',
                };
            } catch (error) {
                console.error("Error sending verification email: ", error)
                return {
                    success: false,
                    message: "Error sending verification email. Please try again later.",
                };
            }
}

