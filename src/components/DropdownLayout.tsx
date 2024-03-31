export default function DropdownLayout(props: { question?: string, options?: string[], answer?: string }) {
    if (props.options) {
        const dropdownchoice: JSX.Element[] = [];
        dropdownchoice.push(<h3 key={"<h3></h3>"}>{props.question}</h3>);
        const dropdownchoiceTemp = <select key={"<select></select>"} onChange={() => {/*lift state lên cho cái page hoặc cái reading layout, truyền vào đây function change state để update câu trả lời của user*/ }} style={{ paddingLeft: "1rem", paddingRight: "1rem", fontSize:"2rem" }}>
            {props.options.map((option: string, index: number) => {
                return <option key={option+"<option></option>"} value={option}>{option}</option>
            })}
        </select>;
        // add all elements of dropdownchoiceTemp into dropdownchoice
        dropdownchoice.push(dropdownchoiceTemp);
        return (
            <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "1rem" }}>{dropdownchoice}</div>
        )
    } else {
        return (<></>)
    }
}   