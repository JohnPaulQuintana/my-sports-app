import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Radar } from "react-chartjs-2";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";
const user = JSON.parse(localStorage.getItem("sport-science-token"));
// Register ChartJS components
ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

const AnalysisChart = ({ data }) => {
  console.log(data);
  const [totalRecord, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const { current, previous } = data?.periods;

  const prepareAthleteData = (athleteData) => {
    const metrics = Object.keys(athleteData.performance);
    // console.log(metrics);
    // Loop through the keys and check if the index is numeric
    metrics.forEach((key, index) => {
      const numericIndex = parseInt(key, 10);

      // Check if the index is a number (e.g., '0', '1', '2', etc.)
      if (!isNaN(numericIndex)) {
        // Assign the category value to the metric at the numeric index
        metrics[key] = athleteData.performance[key]?.category;
        // console.log(
        //   `Category for index ${numericIndex}: ${athleteData.performance[key]?.category}`
        // );
      }
    });

    console.log(metrics);

    const currentAverages = metrics.map(
      (metric) => athleteData.performance[metric].current_period.average
    );
    const previousAverages = metrics.map(
      (metric) => athleteData.performance[metric].previous_period.average
    );
    const improvements = metrics.map(
      (metric) => athleteData.performance[metric].improvement_absolute
    );

    return {
      labels: metrics,
      currentAverages,
      previousAverages,
      improvements,
    };
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Performance Comparison",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Score",
        },
      },
    },
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Performance Radar",
      },
    },
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  // delete recommendation
  const handleDeleteRecom = (r_id, recom) => {
    // alert(r_id)
    Swal.fire({
      title: "Delete Recommendation",
      html: `
          <div class="flex flex-col gap-2">
              <!-- Recommendation Input -->
              <div class="flex flex-col gap-1">
                <label for="recommendation" class="">Recommendation</label>
                <textarea 
                  id="recommendation_delete" 
                  placeholder="Enter your recommendation to enhance performance..." 
                  class="border p-2 rounded-sm min-h-[100px] resize-y"
                >${recom}</textarea>
              </div>

          </div>
        `,
      showCancelButton: true,
      confirmButtonText: "Save",
      showLoaderOnConfirm: true,
      preConfirm: async () => {

        try {
          const response = await fetch(
            `${API_BASE_URL}/api/coach/recommendation/delete`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
              },
              body: JSON.stringify({
                recom_id: r_id,
              }),
            }
          );

          if (!response.ok) {
            return Swal.showValidationMessage(
              `Error: ${JSON.stringify(await response.json())}`
            );
          }

          return response.json();
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `Successfully added!`,
          // imageUrl: result.value.avatar_url
        });

        localStorage.setItem('active-session','dashboard')
        window.location.href = '/dashboard'
      }
    });
  }
  // edit recommendation
  const handleEditRecom = (r_id, recom) => {
    // alert(r_id)
    Swal.fire({
      title: "Edit Recommendation",
      html: `
          <div class="flex flex-col gap-2">
              <!-- Recommendation Input -->
              <div class="flex flex-col gap-1">
                <label for="recommendation" class="">Recommendation</label>
                <textarea 
                  id="recommendation_edit" 
                  placeholder="Enter your recommendation to enhance performance..." 
                  class="border p-2 rounded-sm min-h-[100px] resize-y"
                >${recom}</textarea>
              </div>

          </div>
        `,
      showCancelButton: true,
      confirmButtonText: "Save",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const recommendation_edit = document.getElementById("recommendation_edit").value;
        if (!recommendation_edit) {
          return Swal.showValidationMessage(
            "Please give recommendation to athlete before sending it..."
          );
        }

        try {
          const response = await fetch(
            `${API_BASE_URL}/api/coach/recommendation/update`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
              },
              body: JSON.stringify({
                recom_id: r_id,
                recommendation: recommendation_edit,
              }),
            }
          );

          if (!response.ok) {
            return Swal.showValidationMessage(
              `Error: ${JSON.stringify(await response.json())}`
            );
          }

          return response.json();
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `Successfully added!`,
          // imageUrl: result.value.avatar_url
        });

        localStorage.setItem('active-session','dashboard')
        window.location.href = '/dashboard'
      }
    });
  }
  // adding recommendation
  const handleRecommendation = (label, sport, athelete_id) => {
    console.log(athelete_id, label, sport);
    Swal.fire({
      title: "Recommendation to Athlete",
      html: `
          <div class="flex flex-col gap-2">
              <div class="flex flex-col gap-2 items-center">
                <label>Selected Category</label>
                <input value="${label}" class="border p-2 rounded-sm text-center" readonly/>
              </div>

              <!-- Recommendation Input -->
              <div class="flex flex-col gap-1">
                <label for="recommendation" class="">Recommendation</label>
                <textarea 
                  id="recommendation" 
                  placeholder="Enter your recommendation to enhance performance..." 
                  class="border p-2 rounded-sm min-h-[100px] resize-y"
                ></textarea>
              </div>

          </div>
        `,
      showCancelButton: true,
      confirmButtonText: "Save",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const recommendation = document.getElementById("recommendation").value;
        if (!recommendation) {
          return Swal.showValidationMessage(
            "Please give recommendation to athlete before sending it..."
          );
        }

        try {
          const response = await fetch(
            `${API_BASE_URL}/api/coach/recommendation`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
              },
              body: JSON.stringify({
                athlete_id: athelete_id,
                category: label,
                recommendation: recommendation,
                sport: sport,
                // sport_id: sport_id,
              }),
            }
          );

          if (!response.ok) {
            return Swal.showValidationMessage(
              `Error: ${JSON.stringify(await response.json())}`
            );
          }

          return response.json();
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `Successfully added!`,
          // imageUrl: result.value.avatar_url
        });
      }
    });
  };
  const handlePrint = async () => {
    setLoading(true);

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      let currentY = 15; // Start at the top of the page

      // Loop over each athlete and capture the card
      for (let i = 0; i < data.analysis.length; i++) {
        console.log(i);
        const card = document.getElementById(`athlete-card-${i}`);

        // Use html2canvas to capture the content of the card as an image
        const canvas = await html2canvas(card, { scale: 1 });
        const imgData = canvas.toDataURL("image/png");

        const imgWidth = pdfWidth - 20; // Set image width to fit within the page width
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add the image to the PDF
        pdf.addImage(imgData, "PNG", 10, currentY, imgWidth, imgHeight);

        currentY += imgHeight + 15; // Update Y position for next image

        // If the content exceeds the page height, add a new page
        if (currentY + imgHeight > pdfHeight) {
          pdf.addPage();
          currentY = 15; // Reset Y position for the next page
        }
      }

      // Save the PDF
      pdf.save("athlete-performance-report.pdf");
    } catch (error) {
      console.error("Error generating PDF", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="performance-dashboard">
      <div className="py-2">
        {/* <h2 className="text-xl font-semibold text-gray-700 py-2">
          Athletic Performance Analysis ({current} vs {previous})
        </h2> */}
        <button
          onClick={handlePrint}
          className="text-sm p-1 bg-red-500 text-white hover:bg-red-700 hover:cursor-pointer rounded-sm"
          id="printBtn"
          type="button"
          disabled={loading}
        >
          {loading ? (
            <i className="fa-sharp fa-solid fa-spinner fa-spin pr-1"></i>
          ) : (
            <i className="fa-sharp fa-solid fa-print pr-1"></i>
          )}
          {loading ? "Generating PDF..." : "Print Document"}
        </button>
        {/* <input type="date" name="" id="" value={end_date} className="border p-1" onChange={handleEndDateChange} /> */}
      </div>

      <div id="contents">
        {data.analysis.map((athlete, index) => {
          const chartData = prepareAthleteData(athlete);
          console.log(chartData);
          const barData = {
            labels: chartData.labels,
            datasets: [
              {
                label: `${current} Average`,
                data: chartData.currentAverages,
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
              {
                label: `${previous} Average`,
                data: chartData.previousAverages,
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          };

          const radarData = {
            labels: chartData.labels,
            datasets: [
              {
                label: `${current}`,
                data: chartData.currentAverages,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                pointBackgroundColor: "rgba(54, 162, 235, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(54, 162, 235, 1)",
              },
              {
                label: `${previous}`,
                data: chartData.previousAverages,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                pointBackgroundColor: "rgba(75, 192, 192, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(75, 192, 192, 1)",
              },
            ],
          };

          return (
            <div
              key={index}
              id={`athlete-card-${index}`}
              className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 w-full"
            >
              <div className="flex flex-col mb-4 items-center justify-center w-full">
                <h2 className="text-2xl font-bold text-gray-700 py-2">
                  Athletic Performance Analysis Report
                </h2>
                <p className="text-gray-600">
                  Performed Date : {current} vs {previous}
                </p>
              </div>
              {/* Card Header */}
              <div className="px-5 py-1 bg-gradient-to-r from-primary to-green-700">
                <h3 className="text-lg font-semibold text-white">
                  {athlete.athlete}{" "}
                  <span className="font-normal opacity-90">
                    - {athlete.sport}
                  </span>
                </h3>
              </div>

              {/* Charts Row */}
              <div className="flex flex-col tablet:flex-row p-4 gap-4 border-b border-gray-100 w-full">
                <div className="flex-1 w-full">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    PERFORMANCE TREND
                  </h4>
                  <div className="bg-gray-50 rounded p-2 w-full overflow-hidden">
                    <div className="w-full">
                      <Bar
                        className="w-full h-60"
                        data={barData}
                        options={barOptions}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-1 w-full mt-4 tablet:mt-0">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    SKILLS RADAR
                  </h4>
                  <div className="bg-gray-50 rounded p-2 flex items-center justify-center w-full">
                    <div className="h-60 w-auto">
                      <Radar
                        className="bg-white w-full"
                        data={radarData}
                        options={radarOptions}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Improvement Indicators */}
              <div className="px-4 py-6 sphone:px-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  PERFORMANCE IMPROVEMENT
                </h4>
                <div className="grid grid-cols-1 sphone:grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 gap-3">
                  {chartData.labels.map((label, idx) => {
                    const improvement = chartData.improvements[idx];
                    const improved = improvement > 0;
                    const declined = improvement < 0;
                    const noChange = improvement === 0;

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border
                        ${improved ? "bg-green-50 border-green-200" : ""}
                        ${declined ? "bg-red-50 border-red-200" : ""}
                        ${noChange ? "bg-gray-50 border-gray-200" : ""}
                      `}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {label}
                          </span>
                          {improved && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M12 7a1 1 0 01-1 1H9v1h2a1 1 0 110 2H9v1h2a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H5a1 1 0 110-2h2v-1H5a1 1 0 110-2h2V8H5a1 1 0 010-2h2V5a1 1 0 112 0v1h2a1 1 0 011 1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Improved
                            </span>
                          )}
                          {declined && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Dropped
                            </span>
                          )}
                          {noChange && (
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                              No change
                            </span>
                          )}
                        </div>
                        <div
                          className={`text-xl font-bold ${
                            improved
                              ? "text-green-600"
                              : declined
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {improvement > 0 ? "+" : ""}
                          {improvement}%
                          {(declined || noChange) && (
                            <button
                              onClick={() => {
                                handleRecommendation(
                                  label,
                                  athlete?.sport,
                                  athlete?.athlete_id
                                );
                              }}
                              type="button"
                              className={`ms-2 border text-xs bg-red-500 text-white p-1 rounded-md ${user.user.role === 'athlete' ? 'hidden' : ''}`}
                            >
                              +Recommendation
                            </button>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {current} vs {previous}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* recommendations */}
              <div className="px-4 py-6 sphone:px-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  RECOMMENDATIONS
                </h4>

                <div className="flex flex-col gap-1">
                  {athlete?.recommendations.map((r) => {
                    // console.log()
                    return (
                      <div key={r?.id} className="border p-1 bg-gray-200">
                        <div className="flex gap-2 items-center justify-between">
                          <p className="ps-1 font-semibold w-fit bg-red-200 p-1">{r?.category}</p>
                          {user?.user?.role === 'coach' && (
                            <div>
                            <button onClick={()=>handleDeleteRecom(r?.id, r?.recommendation)} type="button" className="text-red-600 p-1 rounded-md hover:text-red-700">Delete</button>
                            <button onClick={()=>handleEditRecom(r?.id, r?.recommendation)} type="button" className="text-red-600 p-1 rounded-md hover:text-red-700">Edit</button>
                            </div>
                          )}
                        </div>
                        <p>• {r?.recommendation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalysisChart;
