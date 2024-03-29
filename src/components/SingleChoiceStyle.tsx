
export default function SingleChoiceStyle(props: { question?: string, options?: string, answer?: string }) {
    return (
        <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "1rem" }}>
            <input style={{ width: "2rem", height: "2rem" }} type="radio" name={props.question} value={props.options} />
            <label htmlFor="option1">{props.options}</label>
        </div>
    )
}