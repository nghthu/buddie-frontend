import { ResponseData } from '@/common';
import { NextResponse } from 'next/server';

export interface PostSignupData {
  claims: {
    admin: boolean;
    standard_request_count: number;
    pro_request_count: number;
  };
  general_report: {
    user_id: string;
    time_spent: {
      speaking: number;
      reading: number;
      listening: number;
      writing: number;
      custom: number;
    };
    standard_request_count: {
      translate: number;
      speaking_idea: number;
      paraphrase_writing: number;
      assess_writing: number;
      synonyms: number;
      paraphrase_reading: number;
      generate_heading: number;
    };
    pro_request_count: {
      assess_speaking: number;
    };
    created_at: string;
    updated_at: string;
  };
}

export const POST = async function setCustomClaims(req: Request) {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/users/post-signup`,
      {
        method: 'POST',
        headers: req.headers,
      }
    );

    const data: ResponseData<PostSignupData> = await response.json();
    return NextResponse.json(data);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(error);
  }
};
