import { NextRequest, NextResponse } from 'next/server';
// import chalk from 'chalk';
// import { NextApiResponse } from 'next';
// import { Readable } from 'stream';

export const GET = async function getFile(req: NextRequest) {
  try {
    console.log(
      'hello',
      `${process.env.API_BASE_URL}/api/v1/file/user-audios/user-gVIadC2MMucZ21qLJX4cY6rwCSc2/tests/myaudio-hometown-part1-2.mp3`
    );
    // const key = req.nextUrl.searchParams.get('key');
    const key =
      'user-audios/user-gVIadC2MMucZ21qLJX4cY6rwCSc2/tests/myaudio-hometown-part1-2.mp3';
    const encode = encodeURIComponent(key);

    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/file/${encode}`,
      {
        headers: req.headers,
      }
    );

    return NextResponse.json(response);

    // const contentType = response.headers.get('Content-Type');
    // if (contentType) res.setHeader('Content-Type', contentType);

    // Pipe the Express server's response stream directly to the client's response

    // const nodeReadableStream = Readable.from(response.body);
    // nodeReadableStream.pipe(res);

    // console.log(chalk.bgCyan('res'), data);
    // readableStream.on('end', () => {
    //   res.end();
    // });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
};

export const POST = async function createAudioFiles(req: Request) {
  try {
    const formData = await req.formData();

    const sendData = new FormData();
    formData.forEach((value, key) => {
      if (key !== 'testId') {
        sendData.append(key, value);
      }
    });

    console.log('---------------', sendData, formData.get('testId'));
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/file/user-audios/tests/${formData.get('testId')}`,
      {
        method: 'POST',
        headers: {
          Authorization: req.headers.get('Authorization') ?? '',
        },
        body: sendData,
      }
    );

    console.log(response);

    let data = await response.json();
    console.log('DATA---------------------------', data);
    data = {
      status: 'success',
      data: [
        {
          key: 'user-audio/user-gVIadC2MMucZ21qLJX4cY6rwCSc2/test-66275c541f6241ccb6954c7c/part-1/audio-852d19b6-2862-4cd3-9d59-faa951fac6e6.mp3',
          filename: 'myaudio-hometown-part1-2.mp3',
        },
        {
          key: 'user-audio/user-gVIadC2MMucZ21qLJX4cY6rwCSc2/test-66275c541f6241ccb6954c7c/part-1/audio-969b2914-9a50-4aae-972b-0661e0ea802e.mp3',
          filename: 'myaudio-hometown-part1-1.mp3',
        },
      ],
      error: {},
    };
    return NextResponse.json(data.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
};
