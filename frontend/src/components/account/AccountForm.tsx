import { Collapse, ColorInput, ColorSwatch, Grid, Group, Paper, Skeleton, TextInput, Title, createStyles } from "@mantine/core"
import { DateInput, DatePickerInput } from "@mantine/dates"
import { UseFormReturnType } from "@mantine/form"
import { useDisclosure } from "@mantine/hooks"
import { DateTime } from "luxon"
import { useEffect } from "react"
import { TbChevronDown, TbChevronRight, TbChevronUp, TbDeviceFloppy, TbRotate2 } from "react-icons/tb"
import { Link } from "react-router-dom"
import useIsPhone from "../../hooks/useIsPhone"
import { AccountDeepQueryResult, AccountFormValues, AccountRequest, AccountTransform, useAccountForm, useAccountFormValues, useEditAccount } from "../../types/Account"
import { CurrencyQueryResult, useCurrencies } from "../../types/Currency"
import { PrimaryIcon, RedIcon, SecondaryIcon } from "../Icons"
import AmountInput from "../input/AmountInput"
import CurrencyInput from "../input/CurrencyInput"
import { useAccountFormList } from "./AccountList"

const useStyles = createStyles((theme) => ({
    AccountLink: {
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    }
}));

export function AccountEdit({ data, ix }: { data: AccountDeepQueryResult, ix: number }) {
    const currencies = useCurrencies();

    const [open, { toggle }] = useDisclosure(false);

    const initial = useAccountFormValues(data);

    const form = useAccountForm(initial);

    const { moveUp, moveDown } = useAccountFormList();

    const editAccount = useEditAccount();
    const [editing, { open: startEdit, close: endEdit }] = useDisclosure(false);

    const reset = () => {
        form.setValues(initial);
        form.resetDirty(initial);
        // close();
    }

    // eslint-disable-next-line
    useEffect(reset, [data])

    const handleSubmit = (values: AccountRequest) => {
        startEdit();
        editAccount.mutate(
            { id: data.id, values },
            {
                onSuccess: () => {
                    editAccount.reset();
                }, onSettled: endEdit
            }
        );
    }

    const { classes } = useStyles();
    const isPhone = useIsPhone();

    if (!currencies.isSuccess)
        return <Skeleton height={100}></Skeleton>
    return <Paper withBorder p='xs'>
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Grid gutter={isPhone ? 'xs' : undefined} align='center'>
                <Grid.Col span='content'>
                    <SecondaryIcon
                        icon={open ? TbChevronDown : TbChevronRight}
                        onClick={toggle}
                    />
                </Grid.Col>
                <Grid.Col span='content'>
                    <ColorSwatch color={form.values.color} size={20} />
                </Grid.Col>
                <Grid.Col span='auto'>
                    {open ?
                        <TextInput {...form.getInputProps('desc')} />
                        :
                        <Link to={`${data.id}`} className={classes.AccountLink}>
                            <Title order={3} lineClamp={1} >
                                {form.values.desc}
                            </Title>
                        </Link>
                    }
                </Grid.Col>
                <Grid.Col span='content'>
                    <Group position='right' spacing='xs'>
                        {
                            form.isDirty() &&
                            <>
                                <PrimaryIcon type='submit' icon={TbDeviceFloppy} loading={editing}
                                    tooltip='save'
                                />
                                <RedIcon icon={TbRotate2}
                                    onClick={reset}
                                    tooltip='discard'
                                />
                            </>
                        }
                        <SecondaryIcon icon={TbChevronUp}
                            onClick={() => moveUp(ix)}
                        />
                        <SecondaryIcon icon={TbChevronDown}
                            onClick={() => moveDown(ix)}
                        />
                    </Group>
                </Grid.Col>
            </Grid>
            <Collapse in={open}>
                <AccountForm form={form} currencies={currencies.data} modal={false} />
            </Collapse>
        </form>
    </Paper>
}

interface AccountFormProps {
    form: UseFormReturnType<AccountFormValues, AccountTransform>
    currencies: CurrencyQueryResult[]
    modal: boolean
}

export const AccountForm = ({ form, currencies, modal }: AccountFormProps) => {
    const isPhone = useIsPhone();

    const c_id = form.values.currency_id;
    const currency = currencies.reduce<CurrencyQueryResult | undefined>(
        (prev, cur) =>
            cur.id.toString() === c_id ? cur : prev, undefined
    );

    return (
        <Grid align='flex-end'>
            {modal &&
                <Grid.Col span={12} order={0}>
                    <TextInput label="account name" withAsterisk
                        {...form.getInputProps('desc')}
                    />
                </Grid.Col>
            }
            <Grid.Col md={modal ? undefined : 3} sm={6} xs={12} orderXs={1} order={modal ? 2 : 1}>
                <ColorInput withAsterisk={modal} label="color"
                    {...form.getInputProps('color')}
                />
            </Grid.Col>
            <Grid.Col md={modal ? undefined : 3} sm={6} xs={12} orderXs={2} order={modal ? 1 : 2}>
                {
                    isPhone ?
                        <DatePickerInput
                            popoverProps={{ withinPortal: modal }}
                            label="tracking since"
                            withAsterisk={modal}

                            {...form.getInputProps('date_created')}
                        />
                        :
                        <DateInput
                            popoverProps={{ withinPortal: modal }}
                            label="tracking since"
                            withAsterisk={modal}

                            {...form.getInputProps('date_created')}
                        />

                }
            </Grid.Col>
            <Grid.Col md={modal ? undefined : 3} sm={6} xs={12} order={3}>
                <CurrencyInput label="currency" withAsterisk={modal}
                    {...form.getInputProps('currency_id')}
                />
            </Grid.Col>
            <Grid.Col md={modal ? undefined : 3} sm={6} xs={12} order={3}>
                <AmountInput withAsterisk={modal}
                    label={form.values.date_created ?
                        `saldo at ${DateTime.fromJSDate(form.values.date_created).toFormat("dd.LL.yy")}`
                        : 'saldo at start'}
                    currency={currency}
                    {...form.getInputProps('starting_saldo')}
                />
            </Grid.Col>
        </Grid>
    )
}