import { useNavigate } from "react-router-dom";

function Index() {
    const navigate = useNavigate();

    const handeleBuyNowClick = () =>{
        navigate('/');
    }

    const handeleAddToCartClick = () =>{
        navigate('/');
    }

    return (
        <div className="index-page">
            <h1>This is after login or signup</h1>

            <button 
                onClick = {handeleBuyNowClick}
                className="buynow-button"
            > 
                Buy now
            </button>

            <button 
            onClick = {handeleAddToCartClick}
            className="addtocart-button"
            >
                Add to cart
            </button>
        </div>
    );
}
export default Index;