// import feather from 'feather-icons';
/* -------------------------------------------------------------------------- */
/*                            Feather Icons                                   */
/* -------------------------------------------------------------------------- */

export const featherIconsInit = () => {
    if (window.feather) {
        window.feather.replace({
            width: '16px',
            height: '16px'
        });
    }
};


/* -------------------------------------------------------------------------- */
/*                               Navbar Vertical                              */
/* -------------------------------------------------------------------------- */

export const handleNavbarVerticalCollapsed = () => {
    const { getItemFromStore, setItemToStore, resize } = window.phoenix.utils;
    const Selector = {
        HTML: 'html',
        BODY: 'body',
        NAVBAR_VERTICAL: '.navbar-vertical',
        NAVBAR_VERTICAL_TOGGLE: '.navbar-vertical-toggle',
        NAVBAR_VERTICAL_COLLAPSE: '.navbar-vertical .navbar-collapse',
        ACTIVE_NAV_LINK: '.navbar-vertical .nav-link.active'
    };

    const Events = {
        CLICK: 'click',
        MOUSE_OVER: 'mouseover',
        MOUSE_LEAVE: 'mouseleave',
        NAVBAR_VERTICAL_TOGGLE: 'navbar.vertical.toggle'
    };
    const ClassNames = {
        NAVBAR_VERTICAL_COLLAPSED: 'navbar-vertical-collapsed'
    };
    const navbarVerticalToggle = document.querySelector(
        Selector.NAVBAR_VERTICAL_TOGGLE
    );
    // const html = document.querySelector(Selector.HTML);
    const navbarVerticalCollapse = document.querySelector(
        Selector.NAVBAR_VERTICAL_COLLAPSE
    );
    const activeNavLinkItem = document.querySelector(Selector.ACTIVE_NAV_LINK);
    if (navbarVerticalToggle) {
        navbarVerticalToggle.addEventListener(Events.CLICK, e => {
            const isNavbarVerticalCollapsed = getItemFromStore(
                'phoenixIsNavbarVerticalCollapsed',
                false
            );
            navbarVerticalToggle.blur();
            document.documentElement.classList.toggle(
                ClassNames.NAVBAR_VERTICAL_COLLAPSED
            );

            // Set collapse state on localStorage
            setItemToStore(
                'phoenixIsNavbarVerticalCollapsed',
                !isNavbarVerticalCollapsed
            );

            const event = new CustomEvent(Events.NAVBAR_VERTICAL_TOGGLE);
            e.currentTarget?.dispatchEvent(event);
        });
    }
    if (navbarVerticalCollapse) {
        const isNavbarVerticalCollapsed = getItemFromStore(
            'phoenixIsNavbarVerticalCollapsed',
            false
        );
        if (activeNavLinkItem && !isNavbarVerticalCollapsed) {
            activeNavLinkItem.scrollIntoView({ behavior: 'smooth' });
        }
    }
    const setDocumentMinHeight = () => {
        const bodyHeight = document.querySelector(Selector.BODY).offsetHeight;
        const navbarVerticalHeight = document.querySelector(
            Selector.NAVBAR_VERTICAL
        )?.offsetHeight;

        if (
            document.documentElement.classList.contains(
                ClassNames.NAVBAR_VERTICAL_COLLAPSED
            ) &&
            bodyHeight < navbarVerticalHeight
        ) {
            document.documentElement.style.minHeight = `${navbarVerticalHeight}px`;
        } else {
            document.documentElement.removeAttribute('style');
        }
    };

    // set document min height for collapse vertical nav
    setDocumentMinHeight();
    resize(() => {
        setDocumentMinHeight();
    });
    if (navbarVerticalToggle) {
        navbarVerticalToggle.addEventListener('navbar.vertical.toggle', () => {
            setDocumentMinHeight();
        });
    }
};



// import * as echarts from 'echarts';
const { merge } = window._;

// form config.js
const echartSetOption = (
    chart,
    userOptions,
    getDefaultOptions,
    responsiveOptions
) => {
    const { breakpoints, resize } = window.phoenix.utils;
    const handleResize = options => {
        Object.keys(options).forEach(item => {
            if (window.innerWidth > breakpoints[item]) {
                chart.setOption(options[item]);
            }
        });
    };

    const themeController = document.body;
    // Merge user options with lodash
    chart.setOption(merge(getDefaultOptions(), userOptions));

    const navbarVerticalToggle = document.querySelector(
        '.navbar-vertical-toggle'
    );
    if (navbarVerticalToggle) {
        navbarVerticalToggle.addEventListener('navbar.vertical.toggle', () => {
            chart.resize();
            if (responsiveOptions) {
                handleResize(responsiveOptions);
            }
        });
    }

    resize(() => {
        chart.resize();
        if (responsiveOptions) {
            handleResize(responsiveOptions);
        }
    });
    if (responsiveOptions) {
        handleResize(responsiveOptions);
    }

    themeController.addEventListener(
        'clickControl',
        ({ detail: { control } }) => {
            if (control === 'phoenixTheme') {
                chart.setOption(window._.merge(getDefaultOptions(), userOptions));
            }
        }
    );
};

/* -------------------------------------------------------------------------- */
/*                             Echarts Total Sales                            */
/* -------------------------------------------------------------------------- */

export const totalSalesChartInit = () => {
    const { getColor, getData, getDates } = window.phoenix.utils;
    const $totalSalesChart = document.querySelector('.echart-total-sales-chart');

    // getItemFromStore('phoenixTheme')

    const dates = getDates(
        new Date('5/1/2022'),
        new Date('5/30/2022'),
        1000 * 60 * 60 * 24
    );

    const currentMonthData = [
        100, 200, 300, 300, 300, 250, 200, 200, 200, 200, 200, 500, 500, 500, 600,
        700, 800, 900, 1000, 1100, 850, 600, 600, 600, 400, 200, 200, 300, 300, 300
    ];

    const prevMonthData = [
        200, 200, 100, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 200, 400, 600,
        600, 600, 800, 1000, 700, 400, 450, 500, 600, 700, 650, 600, 550
    ];

    const tooltipFormatter = params => {
        const currentDate = window.dayjs(params[0].axisValue);
        const prevDate = window.dayjs(params[0].axisValue).subtract(1, 'month');

        const result = params.map((param, index) => ({
            value: param.value,
            date: index > 0 ? prevDate : currentDate,
            color: param.color
        }));

        let tooltipItem = ``;
        result.forEach((el, index) => {
            tooltipItem += `<h6 class="fs-9 text-body-tertiary ${index > 0 && 'mb-0'
                }"><span class="fas fa-circle me-2" style="color:${el.color}"></span>
      ${el.date.format('MMM DD')} : ${el.value}
    </h6>`;
        });
        return `<div class='ms-1'>
              ${tooltipItem}
            </div>`;
    };

    if ($totalSalesChart) {
        const userOptions = getData($totalSalesChart, 'echarts');
        const chart = window.echarts.init($totalSalesChart);

        const getDefaultOptions = () => ({
            color: [getColor('primary'), getColor('info')],
            tooltip: {
                trigger: 'axis',
                padding: 10,
                backgroundColor: getColor('body-highlight-bg'),
                borderColor: getColor('border-color'),
                textStyle: { color: getColor('light-text-emphasis') },
                borderWidth: 1,
                transitionDuration: 0,
                axisPointer: {
                    type: 'none'
                },
                formatter: tooltipFormatter
            },
            xAxis: [
                {
                    type: 'category',
                    data: dates,
                    axisLabel: {
                        formatter: value => window.dayjs(value).format('DD MMM'),
                        interval: 13,
                        showMinLabel: true,
                        showMaxLabel: false,
                        color: getColor('secondary-color'),
                        align: 'left',
                        fontFamily: 'Nunito Sans',
                        fontWeight: 600,
                        fontSize: 12.8
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: getColor('secondary-bg')
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        interval: 0,
                        lineStyle: {
                            color:
                                window.config.config.phoenixTheme === 'dark'
                                    ? getColor('body-highlight-bg')
                                    : getColor('secondary-bg')
                        }
                    },
                    boundaryGap: false
                },
                {
                    type: 'category',
                    position: 'bottom',
                    data: dates,
                    axisLabel: {
                        formatter: value => window.dayjs(value).format('DD MMM'),
                        interval: 130,
                        showMaxLabel: true,
                        showMinLabel: false,
                        color: getColor('secondary-color'),
                        align: 'right',
                        fontFamily: 'Nunito Sans',
                        fontWeight: 600,
                        fontSize: 12.8
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    boundaryGap: false
                }
            ],
            yAxis: {
                position: 'right',
                axisPointer: { type: 'none' },
                axisTick: 'none',
                splitLine: {
                    show: false
                },
                axisLine: { show: false },
                axisLabel: { show: false }
            },
            series: [
                {
                    name: 'd',
                    type: 'line',
                    // data: Array.from(Array(30).keys()).map(() =>
                    //   getRandomNumber(100, 300)
                    // ),
                    data: currentMonthData,
                    showSymbol: false,
                    symbol: 'circle',
                    zlevel: 2
                },
                {
                    name: 'e',
                    type: 'line',
                    // data: Array.from(Array(30).keys()).map(() =>
                    //   getRandomNumber(100, 300)
                    // ),
                    data: prevMonthData,
                    // symbol: 'none',
                    lineStyle: {
                        type: 'dashed',
                        width: 1,
                        color: getColor('info')
                    },
                    showSymbol: false,
                    symbol: 'circle',
                    zlevel: 1
                }
            ],
            grid: {
                right: 2,
                left: 5,
                bottom: '20px',
                top: '2%',
                containLabel: false
            },
            animation: false
        });
        echartSetOption(chart, userOptions, getDefaultOptions);
    }
};
