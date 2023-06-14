import { Button, ColorSwatch, Flex, Group, Text, Title, useMantineTheme } from "@mantine/core";
import { DateTime } from "luxon";
import { useState } from "react";
import { TbCirclePlus } from "react-icons/tb";
import { addTransactionAction } from "../../actions/actions";
import Placeholder from "../../components/Placeholder";
import { FilterableChanges } from "../../components/account/ChangePills";
import useAmount from "../../hooks/useAmount";
import { useAccount } from "../../types/Account";
import NotFound from "../404";
import { useRouter } from "next/navigation";

export default function AccountPage() {
    const theme = useMantineTheme();
    const router = useRouter();
    const id = router.query.id as string | undefined;
    const query = useAccount(parseInt(id ?? "-1"));
    const [loading, setLoading] = useState(false);
    const saldo = useAmount(query.data?.saldo, query.data?.currency);

    if (!id?.match(/\d+/) || (query.isError && query.error.response?.status === 404))
        return <NotFound />
    if (!query.isSuccess)
        return <Placeholder queries={[query]} />

    const { data: account } = query;

    const date_created = DateTime.fromISO(account.date_created as string);

    return <>
        <Flex justify="space-between" wrap='wrap'>
            <Group noWrap>
                <Title order={1}>{account.desc}</Title>
                <ColorSwatch color={account.color} size={theme.headings.sizes.h1.fontSize} />
            </Group>
            <Title order={1} lineClamp={1}>{saldo}</Title>

        </Flex>
        <Text fz="md">Tracking since {date_created.toRelative()}</Text>
        <Button size="lg" my="md" fullWidth loading={loading} leftIcon={
            <TbCirclePlus size={40} />
        } onClick={() => {
            setLoading(true);
            addTransactionAction({ account }).then(
                () => setLoading(false)
            )
        }} />
        <FilterableChanges id={account.id} />
    </>;
}
