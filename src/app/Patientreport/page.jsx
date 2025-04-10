"use client";
import React, {
  useState,
  useEffect,
  useRef,
  PureComponent,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ScatterChart,
  Scatter,
  ErrorBar,
  LabelList,
  ComposedChart,
  Bar,
} from "recharts";

import Image from "next/image";

import { Poppins } from "next/font/google";

import ProfileImage from "@/app/assets/profile.png";
import { UserIcon } from "@heroicons/react/24/outline";
import {
  ChevronRightIcon,
  ArrowUpRightIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilSquareIcon,
} from "@heroicons/react/16/solid";
import Patientimg from "@/app/assets/patimg.png";
import Closeicon from "@/app/assets/closeicon.png";

import Surgeryreport from "@/app/Surgeryreport/page";

import "@/app/globals.css";

// Original raw data
const boxPlotData = [
  {
    name: "PREOP",
    boxData: [
      22, 25, 27, 26, 24, 28, 29, 31, 30, 26, 27, 28, 29, 30, 31, 32, 33, 35,
      36,
    ],
    dotValue: 29,
  },
  {
    name: "6 WEEKS",
    boxData: [
      28, 30, 29, 31, 32, 33, 34, 35, 30, 29, 31, 32, 34, 36, 37, 33, 35, 38,
      39,
    ],
    dotValue: 34,
  },
  {
    name: "3 MONTHS",
    boxData: [
      34, 36, 38, 37, 35, 36, 37, 38, 39, 40, 36, 35, 34, 37, 38, 39, 40, 41,
      42,
    ],
    dotValue: 39,
  },
  {
    name: "6 MONTHS",
    boxData: [
      38, 39, 40, 42, 41, 40, 39, 38, 41, 42, 40, 39, 40, 41, 42, 43, 44, 45,
      46,
    ],
    dotValue: 42,
  },
  {
    name: "1 YEAR",
    boxData: [
      41, 42, 43, 44, 45, 44, 43, 42, 41, 42, 44, 45, 46, 47, 45, 46, 47, 48,
      47,
    ],
    dotValue: 46,
  },
];

// === Helper functions ===
const quantile = (arr, q) => {
  const pos = (arr.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return arr[base] + rest * (arr[base + 1] - arr[base]);
};

const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

const computeBoxStats = (data,mean) => {
  const sorted = [...data].sort((a, b) => a - b);
  return {
    min: sorted[0],
    lowerQuartile: quantile(sorted, 0.25),
    median: quantile(sorted, 0.5),
    upperQuartile: quantile(sorted, 0.75),
    max: sorted[sorted.length - 1],
    average: mean,
  };
};

// === Shape Components ===
const HorizonBar = (props) => {
  const { cx, cy, payload, dataKey, width = 30 } = props;

  if (cx == null || cy == null || !payload) return null;
  const isMedian = dataKey === "_median";
    const length = isMedian ? 30 : 10;

  return (
    <line
      x1={cx - length / 2}
      y1={cy}
      x2={cx + length / 2}
      y2={cy}
      stroke={dataKey === "_median" ? "#FFFFFF" : "#4A3AFF"}
      strokeWidth={2}
    />
  );
};

const DotBar = ({ x, y, width, height }) => {
  if (x == null || y == null || width == null || height == null) return null;
  return (
    <line
      x1={x + width / 2}
      y1={y + height}
      x2={x + width / 2}
      y2={y}
      stroke="#4A3AFF"
      strokeWidth={3}
      strokeDasharray="0"
    />
  );
};

// === Hook to structure data for chart ===
const useBoxPlot = (boxPlots) => {
  return useMemo(
    () =>
      boxPlots.map((v) => ({
        name: v.name,
        min: v.min,
        bottomWhisker: v.lowerQuartile - v.min,
        bottomBox: v.median - v.lowerQuartile,
        topBox: v.upperQuartile - v.median,
        topWhisker: v.max - v.upperQuartile,
        medianLine: 0.0001, // dummy to render median bar
        maxLine: 0.0001, // dummy to render max bar
        minLine: 0.0001, // dummy to render min bar (optional)
        average: v.average,
        size: 250,
        _median: v.median, // actual Y position for rendering line
        _max: v.max,
        _min: v.min,
      })),
    [boxPlots]
  );
};

const page = () => {
  const useWindowSize = () => {
    const [size, setSize] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    useEffect(() => {
      const handleResize = () => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return size;
  };

  const { width, height } = useWindowSize();
  // console.log("Screen Width:", width, "Screen Height:", height);

  const data = [
    { name: "-3", oks: 32, sf12: 70, koos: 68, kss: 72, fjs: 65 },
    { name: "SURGERY", oks: 28, sf12: 65, koos: 60, kss: 67, fjs: 58 },
    { name: "+21", oks: 34, sf12: 75, koos: 73, kss: 76, fjs: 70 },
    { name: "+42", oks: 38, sf12: 78, koos: 75, kss: 79, fjs: 73 },
    { name: "+90", oks: 42, sf12: 82, koos: 80, kss: 85, fjs: 80 },
    { name: "+180", oks: 44, sf12: 85, koos: 83, kss: 88, fjs: 84 },
    { name: "+365", oks: 46, sf12: 88, koos: 86, kss: 90, fjs: 88 },
    { name: "+730", oks: 48, sf12: 92, koos: 90, kss: 94, fjs: 91 },
  ];

  const COLORS = {
    oks: "#FF6384",
    sf12: "#36A2EB",
    koos: "#FFCE56",
    kss: "#4BC0C0",
    fjs: "#9966FF",
  };

  //   const data1 = [
  //     { name: "A", x: "A", y: 80 },
  //     { name: "B", x: "B", y: 100 },
  //     { name: "C", x: "C", y: 60 },
  //   ];

  //   // Add ±10 error to each point
  //   const processedData = data1.map((d) => ({
  //     ...d,
  //     error: [10, 10],
  //   }));

  const transformedData = [
    { name: "-3", pcs: 28.67, mcs: 33.75 },
    { name: "SURGERY", pcs: 25.83, mcs: 30.75 },
    { name: "+21", pcs: 30.5, mcs: 36.25 },
    { name: "+42", pcs: 32.67, mcs: 37.75 },
    { name: "+90", pcs: 34.25, mcs: 41 },
    { name: "+180", pcs: 36.25, mcs: 42.25 },
    { name: "+365", pcs: 37.33, mcs: 44 },
    { name: "+730", pcs: 38.67, mcs: 45.75 },
  ];

  const dataPCS = transformedData
    .map((item, index) => ({
      x: index - 0.1,
      label: item.name,
      y: Math.round(Math.abs(item.pcs)),
      error: [10, 10],
    }))
    .filter((item) => item.label !== "SURGERY");

  const dataMCS = transformedData
    .map((item, index) => ({
      x: index + 0.1,
      label: item.name,
      y: Math.round(Math.abs(item.mcs)),
      error: [10, 10],
    }))
    .filter((item) => item.label !== "SURGERY");

  const surgeryIndex = transformedData.findIndex(
    (item) => item.name === "SURGERY"
  );


  const databox = useBoxPlot(
    boxPlotData.map((item, index) => {
      const stats = computeBoxStats(item.boxData, item.dotValue);
      return {
        name: item.name,
        x: index * 10, // ← spacing between box plots here
        ...stats,
      };
    })
  );

  console.log("Box plot:", JSON.stringify(databox, null, 2));

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row w-[95%] mx-auto mt-4 items-center justify-between">
        <div
          className={`w-full rounded-lg flex ${width < 760 ? "py-0" : "py-4"}`}
        >
          <div className={`relative w-full`}>
            <div
              className={`flex gap-4  flex-col justify-center items-center ${
                width < 760 ? "" : "py-0"
              }`}
            >
              <div
                className={`w-full flex gap-4 justify-center items-center ${
                  width < 530
                    ? "flex-col justify-center items-center"
                    : "flex-row"
                }`}
              >
                <Image
                  className={`rounded-full w-14 h-14`}
                  src={Patientimg}
                  alt="alex hales"
                />

                <div
                  className={`w-full flex items-center ${
                    width < 760 ? "flex-col gap-2 justify-center" : "flex-row"
                  }`}
                >
                  <div
                    className={`flex  flex-col gap-3 ${
                      width < 760 ? "w-full" : "w-2/5"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 flex-row ${
                        width < 530 ? "justify-center" : ""
                      }`}
                    >
                      <p
                        className={`text-[#475467] font-poppins font-semibold text-base ${
                          width < 530 ? "text-start" : ""
                        }`}
                      >
                        Patient Name |
                      </p>
                      <p
                        className={`text-black font-poppins font-bold text-base ${
                          width < 530 ? "text-start" : ""
                        }`}
                      >
                        ALEX HALES
                      </p>
                    </div>
                    <div
                      className={`flex flex-row  ${
                        width < 710 && width >= 530
                          ? "w-full justify-between"
                          : ""
                      }`}
                    >
                      <p
                        className={`font-poppins font-semibold text-sm text-[#475467] ${
                          width < 530 ? "text-center" : "text-start"
                        }
                          w-1/2`}
                      >
                        25, Male
                      </p>
                      <div
                        className={`text-sm font-normal font-poppins text-[#475467] w-1/2 ${
                          width < 530 ? "text-center" : ""
                        }`}
                      >
                        UHID 12345678
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex   ${
                      width < 760 ? "w-full" : "w-3/5 justify-center"
                    }
                      ${
                        width < 530
                          ? "flex-col gap-4 justify-center items-center"
                          : "flex-row"
                      }`}
                  >
                    <div
                      className={` flex flex-col gap-3 ${
                        width < 530
                          ? "justify-center items-center w-full"
                          : "w-[20%]"
                      }`}
                    >
                      <p className="text-[#475467] font-semibold text-5">BMI</p>
                      <p className="text-[#04CE00] font-bold text-6">22.8</p>
                    </div>
                    <div
                      className={` flex flex-col gap-3 ${
                        width < 530
                          ? "justify-center items-center w-full"
                          : "w-[40%]"
                      }`}
                    >
                      <p className="text-[#475467] font-semibold text-5">
                        STATUS
                      </p>
                      <p className="text-[#F86060] font-bold text-6">
                        POST OPERATIVE
                      </p>
                    </div>
                    <div
                      className={` flex flex-col gap-3 ${
                        width < 530
                          ? "justify-center items-center w-full"
                          : "w-[30%]"
                      }`}
                    >
                      <p className="text-[#475467] font-semibold text-5">
                        SURGERY REPORT
                      </p>
                      <div className="w-full flex flex-row items-center gap-2">
                        <p className="text-[#F86060] font-bold text-6">
                          PENDING
                        </p>
                        <PencilSquareIcon className="w-5 h-5 text-black cursor-pointer" onClick={() => setIsOpen(true)}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={` h-fit mx-auto flex  mt-5 gap-4 ${
          width < 1415
            ? "w-full flex-col justify-center items-center"
            : "w-[95%] flex-col"
        }`}
      >
        <div className={`w-full flex   gap-4 ${width<1415?"flex-col justify-center items-center h-[1000px]":"flex-row h-[400px]"}`}>
          <div
            className={` flex flex-col bg-white px-4 py-2 rounded-2xl shadow-lg ${width<1415?"w-full h-1/2":"w-1/2"}`}
          >
            <p className="font-bold text-sm text-black">PROM ANALYSIS</p>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart
                data={data}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="8 10" vertical={false} />

                <XAxis
                  dataKey="name"
                  label={{
                    value: "DAYS",
                    position: "insideBottom",
                    offset: -5,
                    style: {
                      fill: "#615E83", // label color
                      fontSize: 14, // label font size
                      fontWeight: 700,
                    },
                  }}
                  tick={{ fill: "#615E83", fontSize: 12, fontWeight: 600 }} // tick values
                />

                <YAxis
                  label={{
                    value: "SCORE",
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      fill: "#615E83", // label color
                      fontSize: 14, // label font size
                      fontWeight: 700,
                    },
                    dx: 15,
                  }}
                  tick={{ fill: "#615E83", fontSize: 12, fontWeight: 600 }} // tick values
                  domain={[0, 100]}
                />

                <Tooltip
                  isAnimationActive={false}
                  content={({ active, payload, label }) => {
                    if (label === "SURGERY" || !active || !payload?.length)
                      return null;

                    return (
                      <div className="bg-white p-2 border rounded shadow text-black">
                        <p className="font-semibold">{label}</p>
                        {payload.map((entry, index) => (
                          <p key={index} style={{ color: entry.stroke }}>
                            {entry.name}: {entry.value}
                          </p>
                        ))}
                      </div>
                    );
                  }}
                />

                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ paddingBottom: 20 }}
                  content={() => {
                    const labels = {
                      oks: "Oxford Knee Score",
                      sf12: "Short Form - 12",
                      koos: "KOOS",
                      kss: "Knee Society Score",
                      fjs: "Forgotten Joint Score",
                    };

                    const colors = {
                      oks: "#4F46E5",
                      sf12: "#A855F7",
                      koos: "#10B981",
                      kss: "#F97316",
                      fjs: "#3B82F6",
                    };

                    return (
                      <ul
                        style={{
                          display: "flex",
                          gap: "20px",
                          listStyle: "none",
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        {Object.entries(labels).map(([key, label]) => (
                          <li
                            key={key}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                backgroundColor: colors[key],
                              }}
                            />
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: 10,
                                color: "black",
                              }}
                            >
                              {label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    );
                  }}
                />

                <ReferenceLine
                  x="SURGERY"
                  stroke="limegreen"
                  strokeWidth={2}
                  ifOverflow="visible"
                  isFront
                />

                {["oks", "sf12", "koos", "kss", "fjs"].map((key, i) => {
                  const colors = [
                    "#4F46E5", // Indigo
                    "#A855F7", // Purple
                    "#10B981", // Emerald
                    "#F97316", // Orange
                    "#3B82F6", // Blue
                  ];

                  const labels = {
                    oks: "Oxford Knee Score",
                    sf12: "Short Form - 12",
                    koos: "KOOS",
                    kss: "Knee Society Score",
                    fjs: "Forgotten Joint Score",
                  };

                  return (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      name={labels[key]}
                      stroke={colors[i]}
                      strokeWidth={2}
                      dot={({ cx, cy, payload }) =>
                        payload.name === "SURGERY" ? null : (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={3}
                            stroke={colors[i]}
                            strokeWidth={1}
                            fill={colors[i]}
                          />
                        )
                      }
                      activeDot={({ payload }) =>
                        payload.name === "SURGERY" ? null : (
                          <circle
                            r={6}
                            stroke="black"
                            strokeWidth={2}
                            fill="white"
                          />
                        )
                      }
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div
            className={`flex flex-col bg-white px-4 py-2 rounded-2xl shadow-lg ${width<1415?"w-full h-1/2":"w-1/2"}`}
          >
            <p className="font-bold text-sm text-black">
              SHORT FORM 12 (PCS vs MCS)
            </p>
            <ResponsiveContainer width="100%" height="90%">
              <ScatterChart
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="8 10" vertical={false} />

                <XAxis
                  type="number"
                  dataKey="x"
                  domain={[-0.5, transformedData.length - 0.5]}
                  tickFormatter={(tick) => {
                    const i = Math.round(tick);
                    return transformedData[i]?.name || "";
                  }}
                  ticks={transformedData.map((_, index) => index)}
                  allowDecimals={false}
                  tick={{ fill: "#615E83", fontSize: 12, fontWeight: 600 }}
                  label={{
                    value: "DAYS",
                    position: "insideBottom",
                    offset: -5,
                    fontWeight: "bold",
                    fill: "#615E83",
                    style: {
                      fill: "#615E83", // label color
                      fontSize: 14, // label font size
                      fontWeight: 700,
                    },
                  }}
                />

                <YAxis
                  type="number"
                  dataKey="y"
                  domain={["dataMin - 10", "dataMax + 10"]}
                  tick={{ fill: "#615E83", fontSize: 12, fontWeight: 600 }}
                  label={{
                    value: "Score ",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    fontWeight: "bold",
                    fill: "#615E83",
                    style: {
                      fill: "#615E83", // label color
                      fontSize: 14, // label font size
                      fontWeight: 700,
                    },
                  }}
                />

                <Tooltip />

                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ paddingBottom: 20 }}
                  content={() => {
                    const labels = {
                      pcs: "Physical Component Summary (PCS)",
                      mcs: "Mental Component Summary (PCS)",
                    };

                    const colors = {
                      pcs: "#4A3AFF",
                      mcs: "#962DFF",
                    };

                    return (
                      <ul
                        style={{
                          display: "flex",
                          gap: "20px",
                          listStyle: "none",
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        {Object.entries(labels).map(([key, label]) => (
                          <li
                            key={key}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                backgroundColor: colors[key],
                              }}
                            />
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: 10,
                                color: "black",
                              }}
                            >
                              {label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    );
                  }}
                />

                <ReferenceLine
                  x={surgeryIndex}
                  stroke="limegreen"
                  strokeWidth={2}
                />

                <Scatter name="Physical (PCS)" data={dataPCS} fill="red">
                  <ErrorBar
                    dataKey="error"
                    direction="y"
                    width={4}
                    stroke="#4A3AFF"
                  />
                </Scatter>

                <Scatter name="Mental (MCS)" data={dataMCS} fill="red">
                  <ErrorBar
                    dataKey="error"
                    direction="y"
                    width={4}
                    stroke="#962DFF"
                  />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`w-full flex   gap-4 ${width<1415?"flex-col justify-center items-center h-[1000px]":"flex-row h-[400px]"}`}>
          <div
            className={`flex flex-col bg-white px-4 py-2 rounded-2xl shadow-lg ${width<1415?"w-full h-1/2":"w-1/2"}`}
          >
            <p className="font-bold text-sm text-black">OXFORD KNEE SCORE </p>
            <ResponsiveContainer width="100%" height="90%">
              <ComposedChart
                data={databox}
                barCategoryGap="70%"
                margin={{ top: 20, bottom: 20, left: 0, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                {/* ✅ Tooltip */}
                <Tooltip
                  contentStyle={{ fontSize: 12, fontWeight: "500" }}
                  labelStyle={{ color: "#333", fontWeight: 600 }}
                  cursor={{ fill: "rgba(97, 94, 131, 0.1)" }}
                />

                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ paddingBottom: 20 }}
                  content={() => {
                    const labels = {
                      other: "Other Patients",
                      oks: "Oxford Knee Score",
                    };

                    const colors = {
                      other: "#4A3AFF",
                      oks: "#04CE00",
                    };

                    return (
                      <ul
                        style={{
                          display: "flex",
                          gap: "20px",
                          listStyle: "none",
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        {Object.entries(labels).map(([key, label]) => (
                          <li
                            key={key}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                backgroundColor: colors[key],
                              }}
                            />
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: 10,
                                color: "black",
                              }}
                            >
                              {label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    );
                  }}
                />

                <Bar stackId="a" dataKey="min" fill="none" />
                <Bar stackId="a" dataKey="bottomWhisker" shape={<DotBar />} />
                <Bar stackId="a" dataKey="bottomBox" fill="#4A3AFF" />
                <Bar stackId="a" dataKey="topBox" fill="#4A3AFF" />
                <Bar stackId="a" dataKey="topWhisker" shape={<DotBar />} />

                {/* Median Line */}
                <Scatter
                  data={databox}
                  shape={(props) => <HorizonBar {...props} dataKey="_median" />}
                  dataKey="_median"
                  
                />

                {/* Min Line */}
                <Scatter
                  data={databox}
                  shape={(props) => <HorizonBar {...props} dataKey="_min" stroke="#4A3AFF"/>}
                  dataKey="_min"
                />

                {/* Max Line */}
                <Scatter
                  data={databox}
                  shape={(props) => <HorizonBar {...props} dataKey="_max" />}
                  dataKey="_max"
                />

                <ZAxis type="number" dataKey="size" range={[0, 250]} />
                <Scatter
                  dataKey="average"
                  fill="#04CE00"
                  stroke="#04CE00"
                  shape={(props) => (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={4}
                      fill="#04CE00"
                      stroke="#FFF"
                    />
                  )}
                />
                <XAxis
                  dataKey="name"
                  type="category"
                  allowDuplicatedCategory={false}
                  tick={{
                    fill: "#615E83",
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                  axisLine={{ stroke: "#615E83" }}
                  tickLine={{ stroke: "#615E83" }}
                />

                <YAxis
                  label={{
                    value: "SCORE",
                    angle: -90,
                    position: "insideLeft",
                    offset: 20,
                    style: {
                      textAnchor: "middle",
                      fill: "#615E83",
                      fontSize: 14,
                      fontWeight: "bold",
                    },
                  }}
                  tick={{ fill: "#615E83", fontSize: 16, fontWeight: "500" }}
                  axisLine={{ stroke: "#615E83" }}
                  tickLine={{ stroke: "#615E83" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className={`flex flex-col bg-white px-4 py-2 rounded-2xl shadow-lg ${width<1415?"w-full h-1/2":"w-1/2"}`}>
          <p className="font-bold text-sm text-black">SHORT FORM 12</p>
            <ResponsiveContainer width="100%" height="90%">
              <ComposedChart
                data={databox}
                barCategoryGap="70%"
                margin={{ top: 20, bottom: 20, left: 0, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                {/* ✅ Tooltip */}
                <Tooltip
                  contentStyle={{ fontSize: 12, fontWeight: "500" }}
                  labelStyle={{ color: "#333", fontWeight: 600 }}
                  cursor={{ fill: "rgba(97, 94, 131, 0.1)" }}
                />

                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ paddingBottom: 20 }}
                  content={() => {
                    const labels = {
                      other: "Other Patients",
                      oks: "Short Form 12",
                    };

                    const colors = {
                      other: "#4A3AFF",
                      oks: "#04CE00",
                    };

                    return (
                      <ul
                        style={{
                          display: "flex",
                          gap: "20px",
                          listStyle: "none",
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        {Object.entries(labels).map(([key, label]) => (
                          <li
                            key={key}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                backgroundColor: colors[key],
                              }}
                            />
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: 10,
                                color: "black",
                              }}
                            >
                              {label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    );
                  }}
                />

                <Bar stackId="a" dataKey="min" fill="none" />
                <Bar stackId="a" dataKey="bottomWhisker" shape={<DotBar />} />
                <Bar stackId="a" dataKey="bottomBox" fill="#4A3AFF" />
                <Bar stackId="a" dataKey="topBox" fill="#4A3AFF" />
                <Bar stackId="a" dataKey="topWhisker" shape={<DotBar />} />

                {/* Median Line */}
                <Scatter
                  data={databox}
                  shape={(props) => <HorizonBar {...props} dataKey="_median" />}
                  dataKey="_median"
                  
                />

                {/* Min Line */}
                <Scatter
                  data={databox}
                  shape={(props) => <HorizonBar {...props} dataKey="_min" stroke="#4A3AFF"/>}
                  dataKey="_min"
                />

                {/* Max Line */}
                <Scatter
                  data={databox}
                  shape={(props) => <HorizonBar {...props} dataKey="_max" />}
                  dataKey="_max"
                />

                <ZAxis type="number" dataKey="size" range={[0, 250]} />
                <Scatter
                  dataKey="average"
                  fill="#04CE00"
                  stroke="#04CE00"
                  shape={(props) => (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={4}
                      fill="#04CE00"
                      stroke="#FFF"
                    />
                  )}
                />
                <XAxis
                  dataKey="name"
                  type="category"
                  allowDuplicatedCategory={false}
                  tick={{
                    fill: "#615E83",
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                  axisLine={{ stroke: "#615E83" }}
                  tickLine={{ stroke: "#615E83" }}
                />

                <YAxis
                  label={{
                    value: "SCORE",
                    angle: -90,
                    position: "insideLeft",
                    offset: 20,
                    style: {
                      textAnchor: "middle",
                      fill: "#615E83",
                      fontSize: 14,
                      fontWeight: "bold",
                    },
                  }}
                  tick={{ fill: "#615E83", fontSize: 16, fontWeight: "500" }}
                  axisLine={{ stroke: "#615E83" }}
                  tickLine={{ stroke: "#615E83" }}
                />
              </ComposedChart>
            </ResponsiveContainer></div>
        </div>

        <div className={`w-full flex   gap-4 ${width<1415?"flex-col justify-center items-center h-[1000px]":"flex-row h-[400px]"}`}>
          <div
            className={`flex flex-col bg-white px-4 py-2 rounded-2xl shadow-lg ${width<1415?"w-full h-1/2":"w-1/2"}`}
          >
            <p className="font-bold text-sm text-black">KNEE INJURY AND OSTEOARTHRITIS OUTCOME SCORE (KOOS)</p>
            <ResponsiveContainer width="100%" height="90%">
              <ComposedChart
                data={databox}
                barCategoryGap="70%"
                margin={{ top: 20, bottom: 20, left: 0, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                {/* ✅ Tooltip */}
                <Tooltip
                  contentStyle={{ fontSize: 12, fontWeight: "500" }}
                  labelStyle={{ color: "#333", fontWeight: 600 }}
                  cursor={{ fill: "rgba(97, 94, 131, 0.1)" }}
                />

                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ paddingBottom: 20 }}
                  content={() => {
                    const labels = {
                      other: "Other Patients",
                      oks: "Knee Injury and Osteoarthritis Outcome Score (KOOS)",
                    };

                    const colors = {
                      other: "#4A3AFF",
                      oks: "#04CE00",
                    };

                    return (
                      <ul
                        style={{
                          display: "flex",
                          gap: "20px",
                          listStyle: "none",
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        {Object.entries(labels).map(([key, label]) => (
                          <li
                            key={key}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                backgroundColor: colors[key],
                              }}
                            />
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: 10,
                                color: "black",
                              }}
                            >
                              {label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    );
                  }}
                />

                <Bar stackId="a" dataKey="min" fill="none" />
                <Bar stackId="a" dataKey="bottomWhisker" shape={<DotBar />} />
                <Bar stackId="a" dataKey="bottomBox" fill="#4A3AFF" />
                <Bar stackId="a" dataKey="topBox" fill="#4A3AFF" />
                <Bar stackId="a" dataKey="topWhisker" shape={<DotBar />} />

                {/* Median Line */}
                <Scatter
                  data={databox}
                  shape={(props) => <HorizonBar {...props} dataKey="_median" />}
                  dataKey="_median"
                  
                />

                {/* Min Line */}
                <Scatter
                  data={databox}
                  shape={(props) => <HorizonBar {...props} dataKey="_min" stroke="#4A3AFF"/>}
                  dataKey="_min"
                />

                {/* Max Line */}
                <Scatter
                  data={databox}
                  shape={(props) => <HorizonBar {...props} dataKey="_max" />}
                  dataKey="_max"
                />

                <ZAxis type="number" dataKey="size" range={[0, 250]} />
                <Scatter
                  dataKey="average"
                  fill="#04CE00"
                  stroke="#04CE00"
                  shape={(props) => (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={4}
                      fill="#04CE00"
                      stroke="#FFF"
                    />
                  )}
                />
                <XAxis
                  dataKey="name"
                  type="category"
                  allowDuplicatedCategory={false}
                  tick={{
                    fill: "#615E83",
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                  axisLine={{ stroke: "#615E83" }}
                  tickLine={{ stroke: "#615E83" }}
                />

                <YAxis
                  label={{
                    value: "SCORE",
                    angle: -90,
                    position: "insideLeft",
                    offset: 20,
                    style: {
                      textAnchor: "middle",
                      fill: "#615E83",
                      fontSize: 14,
                      fontWeight: "bold",
                    },
                  }}
                  tick={{ fill: "#615E83", fontSize: 16, fontWeight: "500" }}
                  axisLine={{ stroke: "#615E83" }}
                  tickLine={{ stroke: "#615E83" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className={`flex flex-col bg-white px-4 py-2 rounded-2xl shadow-lg ${width<1415?"w-full h-1/2":"w-1/2"}`}>
          <p className="font-bold text-sm text-black">KNEE SOCIETY SCORE (KSS)</p>
            <ResponsiveContainer width="100%" height="90%">
              <ComposedChart
                data={databox}
                barCategoryGap="70%"
                margin={{ top: 20, bottom: 20, left: 0, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                {/* ✅ Tooltip */}
                <Tooltip
                  contentStyle={{ fontSize: 12, fontWeight: "500" }}
                  labelStyle={{ color: "#333", fontWeight: 600 }}
                  cursor={{ fill: "rgba(97, 94, 131, 0.1)" }}
                />

                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ paddingBottom: 20 }}
                  content={() => {
                    const labels = {
                      other: "Other Patients",
                      oks: "Knee Scociety Score",
                    };

                    const colors = {
                      other: "#4A3AFF",
                      oks: "#04CE00",
                    };

                    return (
                      <ul
                        style={{
                          display: "flex",
                          gap: "20px",
                          listStyle: "none",
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        {Object.entries(labels).map(([key, label]) => (
                          <li
                            key={key}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                backgroundColor: colors[key],
                              }}
                            />
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: 10,
                                color: "black",
                              }}
                            >
                              {label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    );
                  }}
                />

                <Bar stackId="a" dataKey="min" fill="none" />
                <Bar stackId="a" dataKey="bottomWhisker" shape={<DotBar />} />
                <Bar stackId="a" dataKey="bottomBox" fill="#4A3AFF" />
                <Bar stackId="a" dataKey="topBox" fill="#4A3AFF" />
                <Bar stackId="a" dataKey="topWhisker" shape={<DotBar />} />

                {/* Median Line */}
                <Scatter
                  data={databox}
                  shape={(props) => <HorizonBar {...props} dataKey="_median" />}
                  dataKey="_median"
                  
                />

                {/* Min Line */}
                <Scatter
                  data={databox}
                  shape={(props) => <HorizonBar {...props} dataKey="_min" stroke="#4A3AFF"/>}
                  dataKey="_min"
                />

                {/* Max Line */}
                <Scatter
                  data={databox}
                  shape={(props) => <HorizonBar {...props} dataKey="_max" />}
                  dataKey="_max"
                />

                <ZAxis type="number" dataKey="size" range={[0, 250]} />
                <Scatter
                  dataKey="average"
                  fill="#04CE00"
                  stroke="#04CE00"
                  shape={(props) => (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={4}
                      fill="#04CE00"
                      stroke="#FFF"
                    />
                  )}
                />
                <XAxis
                  dataKey="name"
                  type="category"
                  allowDuplicatedCategory={false}
                  tick={{
                    fill: "#615E83",
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                  axisLine={{ stroke: "#615E83" }}
                  tickLine={{ stroke: "#615E83" }}
                />

                <YAxis
                  label={{
                    value: "SCORE",
                    angle: -90,
                    position: "insideLeft",
                    offset: 20,
                    style: {
                      textAnchor: "middle",
                      fill: "#615E83",
                      fontSize: 14,
                      fontWeight: "bold",
                    },
                  }}
                  tick={{ fill: "#615E83", fontSize: 16, fontWeight: "500" }}
                  axisLine={{ stroke: "#615E83" }}
                  tickLine={{ stroke: "#615E83" }}
                />
              </ComposedChart>
            </ResponsiveContainer></div>
        </div>

        <div className={`w-full flex   gap-4 ${width<1415?"flex-col justify-center items-center h-[500px]":"flex-row h-[400px]"}`}>
          <div
            className={`flex flex-col bg-white px-4 py-2 rounded-2xl shadow-lg ${width<1415?"w-full h-full":"w-1/2"}`}
          >
            <p className="font-bold text-sm text-black">FORGOTTEN JOINT SCORE (FJS) </p>
            <ResponsiveContainer width="100%" height="90%">
              <ComposedChart
                data={databox}
                barCategoryGap="70%"
                margin={{ top: 20, bottom: 20, left: 0, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                {/* ✅ Tooltip */}
                <Tooltip
                  contentStyle={{ fontSize: 12, fontWeight: "500" }}
                  labelStyle={{ color: "#333", fontWeight: 600 }}
                  cursor={{ fill: "rgba(97, 94, 131, 0.1)" }}
                />

                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ paddingBottom: 20 }}
                  content={() => {
                    const labels = {
                      other: "Other Patients",
                      oks: "Forgotten Joint Score",
                    };

                    const colors = {
                      other: "#4A3AFF",
                      oks: "#04CE00",
                    };

                    return (
                      <ul
                        style={{
                          display: "flex",
                          gap: "20px",
                          listStyle: "none",
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        {Object.entries(labels).map(([key, label]) => (
                          <li
                            key={key}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                backgroundColor: colors[key],
                              }}
                            />
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: 10,
                                color: "black",
                              }}
                            >
                              {label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    );
                  }}
                />

                <Bar stackId="a" dataKey="min" fill="none" />
                <Bar stackId="a" dataKey="bottomWhisker" shape={<DotBar />} />
                <Bar stackId="a" dataKey="bottomBox" fill="#4A3AFF" />
                <Bar stackId="a" dataKey="topBox" fill="#4A3AFF" />
                <Bar stackId="a" dataKey="topWhisker" shape={<DotBar />} />

                {/* Median Line */}
                <Scatter
                  data={databox}
                  shape={(props) => <HorizonBar {...props} dataKey="_median" />}
                  dataKey="_median"
                  
                />

                {/* Min Line */}
                <Scatter
                  data={databox}
                  shape={(props) => <HorizonBar {...props} dataKey="_min" stroke="#4A3AFF"/>}
                  dataKey="_min"
                />

                {/* Max Line */}
                <Scatter
                  data={databox}
                  shape={(props) => <HorizonBar {...props} dataKey="_max" />}
                  dataKey="_max"
                />

                <ZAxis type="number" dataKey="size" range={[0, 250]} />
                <Scatter
                  dataKey="average"
                  fill="#04CE00"
                  stroke="#04CE00"
                  shape={(props) => (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={4}
                      fill="#04CE00"
                      stroke="#FFF"
                    />
                  )}
                />
                <XAxis
                  dataKey="name"
                  type="category"
                  allowDuplicatedCategory={false}
                  tick={{
                    fill: "#615E83",
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                  axisLine={{ stroke: "#615E83" }}
                  tickLine={{ stroke: "#615E83" }}
                />

                <YAxis
                  label={{
                    value: "SCORE",
                    angle: -90,
                    position: "insideLeft",
                    offset: 20,
                    style: {
                      textAnchor: "middle",
                      fill: "#615E83",
                      fontSize: 14,
                      fontWeight: "bold",
                    },
                  }}
                  tick={{ fill: "#615E83", fontSize: 16, fontWeight: "500" }}
                  axisLine={{ stroke: "#615E83" }}
                  tickLine={{ stroke: "#615E83" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
    
        </div>
      </div>

      <Surgeryreport isOpen={isOpen} onClose={()=>setIsOpen(false)}/>
    </>
  );
};

export default page;
