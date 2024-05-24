import ReactApexChart from "react-apexcharts";

const Chart = ({ artworks }) => {
  const colors = [
    "#3C50E0",
    "#6577F3",
    "#8FD0EF",
    "#0FADCF",
    "#ff0000",
    "#222222",
  ];

  const options = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors,
    labels: artworks.map((el) => el.category.name),
    legend: {
      show: false,
      position: "bottom",
    },

    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Artworks Analytics
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={artworks.map((el) => el.count)}
            type="donut"
          />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        <div className="sm:w-1/2 w-full px-8">
          {artworks.map((el, i) => (
            <div key={i} className="flex w-full items-center">
              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span> {el.category.name} </span>
                <span> {el.count} </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chart;
