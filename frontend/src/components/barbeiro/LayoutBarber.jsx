import Topbar from "../admin/Topbar";
import { BarberForms } from "./BarberForms";
import { BarberStatCard } from "./StatCard";
import { Topbarbarber } from "./Topbarbarber";
import { Statistic } from "./Statistic";

export function LayoutBarber(){
    return(
        <div className="flex flex-col gap-5 pt-24 px-4 md:px-25">
    <div>
        <Topbarbarber />
    </div>

    <div>
        <BarberStatCard />
    </div>

    <div>
        <BarberForms />
    </div>
    <div>
        <Statistic />
    </div>
</div>
    )
}