export default function MultiChoiceLayout(props: { question?: string, options?: string[], answers?: string }) {
    if (props.options) {
        const multichoice: JSX.Element[] = [];
        multichoice.push(<h3 key={"<h3></h3>"}>{props.question}</h3>);
        const multichoiceTemp = props.options.map((option: string, index: number) => {
            return <div key={option} style={{ width: "100%", display: "flex", alignItems: "center", gap: "1rem" }}>
                <input key={option+"<input>"} style={{ width: "2rem", height: "2rem" }} type="checkbox" name={props.question} value={option} />
                <label htmlFor="option1">{option}</label>
            </div>;
        });
        // add all elements of multichoiceTemp into multichoice
        multichoice.push(...multichoiceTemp);
        return (
            <>{ multichoice }</>
        )
    } else {
        return (<></>)
    }
}   