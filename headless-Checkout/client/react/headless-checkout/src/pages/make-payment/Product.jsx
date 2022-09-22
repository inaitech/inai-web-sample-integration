import inaiLogo from '../../assets/logo/inai_black_logo.png';
import productImg from '../../assets/images/t_shirt.png';

import { useNavigate } from 'react-router-dom';

export default function Product() {
    const navigate = useNavigate();

    function handleClick() {
        navigate(`/make-payment/checkout`);
    }

    return (
        <div className="container flex flex-column align-items-center w-35 gap-20"> 
            <img src={inaiLogo} alt="inai-logo" className='w-35' />
            <img src={productImg} alt="product-img" className='w-70' />
            <span className='font-size-2'>MANCHESTER UNITED 21/22 HOME JERSEY</span>
            <span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias provident quos alias tempora modi explicabo, voluptatum beatae nostrum iusto, impedit veniam libero quia dicta suscipit aliquam at saepe, sunt distinctio tenetur. Ad rerum praesentium nulla inventore illo cupiditate, ea deleniti facere tempora error similique ut ipsum dicta repellendus nemo. Laudantium!
            </span>
            <div className='btn btn-1 border-radius-1' onClick={handleClick}>BUY NOW</div>
        </div>
    );
}
