

// const userFilters = [
//   { label: "All Users", isSelected: true },
//   { label: "Admin", isSelected: false },
//   { label: "Operator", isSelected: false },
//   { label: "Marketing", isSelected: false },
//   { label: "Accounts", isSelected: false },
//   { label: "Dispatch", isSelected: false },
//   { label: "Technician", isSelected: false },
//   { label: "Surveyor", isSelected: false },
// ];
export default function UsersTab() {
//   const [filters, setFilters] = useState(userFilters);
//   const [users, setUsers] = useState<User[]>([]);

  return (
    <div className="my-3">
      <ul
        className="d-flex p-0 pt-2 gap-5 border-bottom"
        style={{ listStyle: "none" }}
      >
        {/* {filters.map((filter) => (
          <li
            key={filter.label}
            style={{ width: "120px", cursor: "pointer" }}
            className={`border-bottom border- 2 ${filter.isSelected ? "border-primary" : "border-transparent"} pb-2 `}
          >
            <Badge label={filter.label} count={123} />
          </li>
        ))} */}
      </ul>
    </div>
  );
}
