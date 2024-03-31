
export default function SingleChoiceLayout(props: { question?: string, options?: string[], answer?: string }) {
    if (props.options) {
        const singlechoice: JSX.Element[] = [];
        singlechoice.push(<h3 key={"<h3></h3>"}>{props.question}</h3>);
        const singlechoiceTemp = props.options.map((option: string, index: number) => {
            return <div key={option} style={{ width: "100%", display: "flex", alignItems: "center", gap: "1rem" }}>
                <input key={option + "<div></div>"} style={{ width: "2rem", height: "2rem" }} type="radio" name={props.question} value={option} />
                <label htmlFor="option1">{option}</label>
            </div>;
        });
        // add all elements of singlechoiceTemp into singlechoice
        singlechoice.push(...singlechoiceTemp);
        return (
            <>{singlechoice}</>
        )
    } else {
        return (<></>)
    }
}   