import { Box, BoxProps, createStyles } from "@mantine/core";
import { MantineColor, useMantineTheme } from "@mantine/styles";
import { Link } from "react-router-dom";

interface FinnanceLogoProps extends BoxProps {
    inverted?: boolean,
    text?: boolean,
    size: number,
    color?: MantineColor
    link?: boolean
}

export default function FinnanceLogo({ inverted, text, size, color, link, ...others }: FinnanceLogoProps) {
    const theme = useMantineTheme();
    const viewBox = text ? "220 205 1328 294" : "220 205 294 294"

    const light = theme.colors.gray[1];
    const dark = theme.colors.gray[7];
    color = theme.fn.themeColor(color || theme.primaryColor, theme.fn.primaryShade());

    const useStyles = createStyles({
        innance: {
            fill: inverted ? light : theme.colorScheme === "dark" ? light : dark
        },
        f: {
            fill: inverted ? color : light
        },
        circle: {
            fill: inverted ? light : color
        }
    })

    const { classes } = useStyles();

    const SVG = () => <svg viewBox={viewBox} xmlns='http://www.w3.org/2000/svg' height={size}>
        {
            text &&
            <path className={classes.innance} d='M556.931,283.588V253.266H530.564v30.322h26.367Zm0,184.424V312.446H530.564V468.012h26.367Zm66.5,0V383.051q0-29.883,12.232-40.576a42.72,42.72,0,0,1,29.077-10.693,34.734,34.734,0,0,1,18.384,4.76,25.363,25.363,0,0,1,10.913,12.745q3.075,7.985,3.076,24.1v94.629h26.367V372.358q0-18.309-1.465-25.635a50.923,50.923,0,0,0-8.2-19.482q-5.861-8.2-17.651-13.257a64.959,64.959,0,0,0-25.855-5.054q-32.374,0-49.512,25.635V312.446h-23.73V468.012h26.367Zm166.846,0V383.051q0-29.883,12.231-40.576a42.724,42.724,0,0,1,29.077-10.693,34.729,34.729,0,0,1,18.384,4.76,25.363,25.363,0,0,1,10.913,12.745q3.077,7.985,3.076,24.1v94.629H890.33V372.358q0-18.309-1.465-25.635a50.954,50.954,0,0,0-8.2-19.482q-5.861-8.2-17.652-13.257a64.954,64.954,0,0,0-25.854-5.054q-32.376,0-49.512,25.635V312.446h-23.73V468.012h26.367Zm247.269,0h27.54a58.349,58.349,0,0,1-6.67-18.677q-1.68-9.739-1.68-46.508V367.67q0-17.577-1.32-24.316a41.533,41.533,0,0,0-8.21-17.944q-5.85-7.1-18.31-11.792t-32.369-4.688q-20.072,0-35.3,5.493T937.937,330.1q-8.058,10.184-11.572,26.734l25.781,3.515q4.246-16.551,13.11-23.071t27.466-6.519q19.917,0,30.028,8.936,7.47,6.591,7.47,22.7,0,1.466-.14,6.885-15.09,5.273-47.026,9.082a188.438,188.438,0,0,0-23.437,3.955,64.073,64.073,0,0,0-18.97,8.642,43.02,43.02,0,0,0-13.623,15.162,42.55,42.55,0,0,0-5.2,20.874q0,19.483,13.769,32.006T975,471.528a81.463,81.463,0,0,0,29.072-5.127q13.56-5.126,28.2-17.578a55.747,55.747,0,0,0,5.28,19.189h0Zm-7.47-68.408q0,17.435-4.25,26.367a41.021,41.021,0,0,1-17.43,18.237,54.376,54.376,0,0,1-27.1,6.665q-15.38,0-23.364-7.031a23.306,23.306,0,0,1-4.321-30.1,22.932,22.932,0,0,1,10.4-8.57q6.736-2.928,23-5.273,28.711-4.1,43.071-9.961V399.6Zm93.89,68.408V383.051q0-29.883,12.23-40.576a42.746,42.746,0,0,1,29.08-10.693,34.707,34.707,0,0,1,18.38,4.76,25.338,25.338,0,0,1,10.92,12.745q3.075,7.985,3.07,24.1v94.629h26.37V372.358q0-18.309-1.46-25.635a50.962,50.962,0,0,0-8.21-19.482q-5.85-8.2-17.65-13.257a64.945,64.945,0,0,0-25.85-5.054q-32.385,0-49.51,25.635V312.446H1097.6V468.012h26.37Zm228.81-27.685q-10.4,9.524-25.93,9.521-19.335,0-31.34-14.209t-12.02-45.557q0-30.9,12.45-45.19t32.38-14.282q13.185,0,22.48,7.91t12.97,23.584l25.63-3.955q-4.545-23.583-20.65-36.4-16.125-12.818-41.46-12.818a75.379,75.379,0,0,0-37.13,9.448q-17.07,9.449-25.42,28.345t-8.35,44.092q0,38.967,19.41,59.839t51.35,20.874q25.485,0,42.99-15.161t21.75-41.968l-25.93-3.369Q1363.185,430.8,1352.78,440.327Zm151.91,1.9q-10.26,7.619-24.76,7.617-19.485,0-32.52-13.623t-14.5-39.258h116.01q0.15-4.686.15-7.031,0-38.524-19.78-59.766t-50.97-21.24q-32.235,0-52.44,21.68-20.22,21.681-20.22,60.937,0,37.941,20,58.96t54.12,21.021q27.1,0,44.53-13.184t23.88-37.06l-27.25-3.369Q1514.94,434.613,1504.69,442.231Zm-56.62-99.463q12.375-12.157,30.54-12.158,20.07,0,32.67,15.234,8.19,9.816,9.96,29.444h-86.87Q1435.69,354.929,1448.07,342.768Z' />
        }

        <g className='logo' fillRule='evenodd'>
            <path className={classes.circle} d='M366.5,210C445.756,210,510,274.471,510,354S445.756,498,366.5,498,223,433.529,223,354,287.248,210,366.5,210Z' />
            <g className={classes.f}>
                <path d='M373.236,467.548V332.489h30.323V311.982H373.236V297.626q0-14.062,4.981-19.189t16.992-5.127a88.644,88.644,0,0,1,15.527,1.465l3.955-23a129.075,129.075,0,0,0-24.609-2.637q-17.286,0-26.88,6.372a33.71,33.71,0,0,0-13.4,16.626q-2.784,7.618-2.783,23.291v16.553H323.725v20.507h23.291V467.548h26.22Z' />
                <path d='M324,348h79v20H324V348Z' />
            </g>
        </g>
    </svg>
    return link ?
        <Box component={Link} to='' {...others}>
            <SVG />
        </Box >
        :
        <Box {...others}>
            <SVG />
        </Box >
}
