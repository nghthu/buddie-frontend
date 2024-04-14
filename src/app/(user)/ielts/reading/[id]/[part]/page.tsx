'use client';
import ReadingLayout from '@/components/ReadingLayout';
import SkillHeader from '@/components/SkillHeader';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
interface questiongroup {
    "is_single_question"?: boolean | object,
    "question_groups_info"?: { "question_groups_duration": number, "question_groups_prompt": string, "question_groups_image_urls": Array<string>, "question_groups_recording": string },
    "questions"?: Array<object>
}
interface subpart {
    "part_number": number,
    "part_duration": number,
    "part_recording": string,
    "part_prompt": string,
    "part_image_urls": Array<string>,
    "question_groups": Array<questiongroup>
}
export default function IeltsPart({params}:{params:{id:string, part:string}}) {
    const router = useRouter();
    const [jsonData, setJsonData] = useState([]);
    const [metaData, setMetaData] = useState(Object);
    const [activePart, setActivePart] = useState('');
    const [answers, setAnswers] = useState({}); // {1: "A", 2: ["B","C"], 3: "False", 4:"arthitis"}
    const [testTime, setTestTime] = useState('unlimited');

    const changePart = (part: string) => {
        setActivePart(part);
    };
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/tests/${params.id}`);
            const data = await res.json();
            const temp_metaData = {...data['data']};
            delete temp_metaData['parts'];
            setMetaData(temp_metaData);
            console.log(data['data']);
            if (params.part === 'all') {
                const partData = data['data']['parts'].map((subpart: subpart) => subpart);
                setJsonData(partData);
                setActivePart('1');
            }
            else {
                const partData = data['data']['parts'].filter((subpart: subpart) => subpart['part_number'] === Number(params.part));
                setJsonData(partData);
                setActivePart(params.part);

            }
        };
        fetchData();
    }, []);
    const parts = jsonData.map((part: subpart) => {
        const prevPart = Math.max(part['part_number'] - 1, 1);
        const nextPart = Math.min(part['part_number'] + 1, jsonData.length);
        return (
            <>
                {activePart === String(part['part_number']) && (
                    <>
                        <ReadingLayout
                            key = {part['part_number']}
                            setPrevState={() => changePart(String(prevPart))}
                            setNextState={() => changePart(String(nextPart))}
                            data={part}
                            setAnswer={setAnswers}
                            answers={answers}
                        />
                    </>
                )}
            </>
        );
    });
    return (
        <>
            <SkillHeader
                title={metaData['test_name']}
                countdownTime={testTime}
            />
            {parts}
        </>
    )
}