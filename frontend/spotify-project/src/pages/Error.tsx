const Error = ({error}) => {
    return ( 
        <div className="Error" style={{'color': 'white', 'height': '100%'}}>
            {error}
        </div>
    );
}
 
export default Error;