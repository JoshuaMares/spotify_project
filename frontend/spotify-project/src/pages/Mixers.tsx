import { useUserMixers } from "../hooks/useUserMixers";
import MixerDetails from "../components/MixerDetails";
import Loading from "./Loading";

const Mixers = () => {
    const mixersObject = useUserMixers();

    return ( 
        <div className="Mixers">
            {mixersObject.isLoading && <Loading/>}
            {!mixersObject.isLoading && mixersObject.mixers.map((mix: any, index: number) => {
                return <MixerDetails mixerProp={mix} key={index}/>
            })}
        </div>
    );
}
 
export default Mixers;