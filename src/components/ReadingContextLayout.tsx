

export default function ReadingContextLayout(props: { context?: string }) {
    return (
        <div style={{ maxHeight: "100vh", overflowY: "scroll" }}>
            {/* context goes inside this TextCard */}
            < h3 > Header goes here</h3 >
            <img src="https://fastly.picsum.photos/id/874/200/300.jpg?hmac=rJgHohZZtli5gr1B42TQbIuoC-GrMDffD-Xukd2Grj8" alt="lorem picsum" />
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut nec aliquet nisl. Nulla non iaculis nunc. Vivamus imperdiet, metus ac luctus pharetra, orci turpis rutrum diam, eu cursus justo velit a nisl. Donec fringilla consectetur magna at fringilla. Interdum et malesuada fames ac ante ipsum primis in faucibus.</p>
            <p> Morbi viverra quis purus in pulvinar. Nullam magna felis, lobortis sed auctor in, vulputate eu mi. Integer imperdiet mauris quis justo aliquet sollicitudin. Etiam laoreet interdum sapien, quis varius odio accumsan et. Suspendisse id vestibulum est, id euismod ipsum. Pellentesque eget neque a mi aliquet hendrerit vel sit amet velit. Nunc consequat ac odio ut sagittis. Maecenas eu dictum orci, suscipit venenatis lectus. Duis id tincidunt tortor. Donec ut nisl id augue condimentum euismod quis vitae nulla. </p>
            {/* end of context */}
        </div>
    );
}