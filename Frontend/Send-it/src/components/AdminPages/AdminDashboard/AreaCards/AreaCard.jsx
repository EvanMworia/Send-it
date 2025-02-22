import PropTypes from "prop-types";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const AreaCard = ({ colors, cardInfo, percentage }) => {
  const filledValue = parseFloat(percentage);
  const remainedValue = 100 - filledValue;

  const data = [
    { name: "Total Parcels", value: remainedValue},
    { name: "Being Processed", value: filledValue },
  ];

  const renderTooltipContent = (value) => {
    return `${value.toFixed(2)} %`;
  };

  return (
    <div className="area-card">
      <div className="area-card-info">
        <h5 className="info-title">{cardInfo.title}</h5>
        <div className="info-value">{cardInfo.value}</div>
        <p className="info-text">{cardInfo.text}</p>
      </div>
      <div className="area-card-chart">
        <PieChart width={100} height={100}>
          <Pie
            data={data}
            cx={50}
            cy={45}
            innerRadius={20}
            outerRadius={40}
            fill="#e4e8ef"
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={450}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={renderTooltipContent} />
        </PieChart>
      </div>
    </div>
  );
};

AreaCard.propTypes = {
  colors: PropTypes.array.isRequired,
  cardInfo: PropTypes.object.isRequired,
  percentage: PropTypes.string.isRequired,
};

export default AreaCard;
