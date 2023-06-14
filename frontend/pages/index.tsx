import { Button, Center, Paper, Skeleton, Text, useMantineTheme } from "@mantine/core";
import { spotlight } from "@mantine/spotlight";
import { DateTime } from "luxon";
import { AiOutlineThunderbolt } from "react-icons/ai";
import FinnanceLogo from "../components/FinnanceLogo";
import AccountPills from "../components/account/AccountPills";
import { Sunburst, SunburstSkeleton } from "../nivo/Sunburst";
import { usePrefetch } from "../actions/query";
import { useCurrencies } from "../types/Currency";
import { useSmallerThan } from "../hooks/useSmallerthan";
import { NivoShell } from "../nivo/Nivo";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const theme = useMantineTheme();
    const query = useCurrencies();
    const router = useRouter();

    const isSm = useSmallerThan('sm');

    usePrefetch();

    return <>
        <AccountPills />
        <Button color={theme.other.colors.quick} fullWidth
            onClick={() => spotlight.open()}
            leftIcon={<AiOutlineThunderbolt size={24} />}
        >
            quick access
        </Button>
        {
            query.isSuccess ?
                <Paper p='sm' onClick={() => router.push('/analytics')} my='sm'>
                    {
                        query.data.length > 0 &&
                        <NivoShell
                            nivo={Sunburst} skeleton={SunburstSkeleton}
                            height={isSm ? 200 : 300}
                            currency_id={query.data[0].id.toString()}
                            min_date={DateTime.now().startOf('month')}
                            max_date={DateTime.now().endOf('month')}
                            is_expense={true}
                        />
                    }
                    {
                        query.data.length === 0 &&
                        <Text align='center'>no expenses this month</Text>
                    }
                </Paper>
                :
                <Skeleton height={200} my='sm' />
        }
        <Center mt={75}>
            <FinnanceLogo opacity={0.1} size={200} />
        </Center>
    </>;
}
