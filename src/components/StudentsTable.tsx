import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  styled,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
  Avatar,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import TuneIcon from "@mui/icons-material/Tune";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";

import AddModal from "./AddModal";
import DeleteModal from "./DeleteModal";
import type { TableRows } from "../types";
import { getStudents } from "../lib/http";
import { useLanguage } from "../hooks/useSession";
import pencilImage from "../assets/pencil.svg";
import binImage from "../assets/bin.svg";
import femaleImage from "../assets/female.svg";
import maleImage from "../assets/male.svg";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1F7BF4",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StudentsTable = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<TableRows | null>(null);
  const [filteredRows, setFilteredRows] = useState<TableRows[] | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchType, setSearchType] = useState("equal");
  const [searchDate, setSearchDate] = useState("");
  const { t, i18n } = useTranslation();

  const token = localStorage.getItem("token");
  const { language } = useLanguage();

  const params = new URLSearchParams(search);

  const { data, isLoading } = useQuery({
    queryKey: ["get-students"],
    queryFn: () => getStudents(token!),
    enabled: token !== null,
  });

  const editClickHandler = (student: TableRows) => {
    setEditStudent(student);
    toggleModalHandler();
  };

  const toggleModalHandler = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDeleteModal = () => {
    params.delete("student-id");
    navigate({ search: params.toString() });

    setIsDeleteModalOpen(false);
  };

  const blurHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    params.set("query", e.currentTarget.value);
    navigate({ search: params.toString() });
  };

  let rows: TableRows[] = [];

  if (data && !isLoading) {
    rows = data.map((row) => ({
      ...row,
      gradeId: row.grade.id,
      genderId: row.gender.id,
      grade: row.grade.translations.find((i) => i.cultureCode === language)!
        .name,
      gender: row.gender.translations.find((i) => i.cultureCode === language)!
        .name,
    }));
  }

  useEffect(() => {
    const q = params.get("query");

    if (q) {
      const filteredRows = rows.filter(
        (row) =>
          row.lastName.toLowerCase().includes(q.toLowerCase()) ||
          row.firstName.toLowerCase().includes(q.toLowerCase())
      );
      setFilteredRows(filteredRows);
    } else {
      params.delete("query");
      navigate({ search: params.toString() });
      setFilteredRows(null);
    }
  }, [search]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSearch = () => {
    const filtered = rows.filter((row) => {
      const rowDate = new Date(row.birthDate);
      const searchDateObj = new Date(searchDate);

      if (searchType === "equal") {
        if (
          rowDate.getFullYear() !== searchDateObj.getFullYear() ||
          rowDate.getMonth() !== searchDateObj.getMonth() ||
          rowDate.getDate() !== searchDateObj.getDate()
        ) {
          return false;
        }
      } else if (searchType === "greater") {
        if (rowDate > searchDateObj) {
          return false;
        }
      } else if (searchType === "less") {
        if (rowDate < searchDateObj) {
          return false;
        }
      }
      return true;
    });

    setFilteredRows(filtered);
  };

  const currentRows = filteredRows || rows || [];
  const paginatedRows = currentRows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <>
      <Box
        sx={{
          display: { xs: "block", md: "flex" },
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 1 },
          alignItems: { xs: "center" },
          mb: 3,
          direction: i18n.language === "ar" ? "rtl" : "ltr",
        }}
      >
        <TuneIcon
          width={20}
          color="primary"
          sx={{ display: { xs: "none", md: "inline" } }}
        />
        <Typography
          sx={{ display: { xs: "none", md: "inline" } }}
          variant="h6"
          component="h5"
          color="#1F7BF4"
        >
          {t("studentsTable.filterBy")}
        </Typography>

        <TextField
          onChange={blurHandler}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              backgroundColor: "rgba(119, 116, 116, 0.1)",
              width: { xs: 220, sm: 230, xl: 260 },
              height: 49,
              mb: { xs: 2, md: 0 },
            },
          }}
          placeholder={t("studentsTable.searchPlaceholder")}
        />
        <Box
          sx={{
            display: "flex",
            height: 49,
            borderRadius: 2,
          }}
        >
          <FormControl
            sx={{
              minWidth: 90,
              height: 49,
              backgroundColor: "rgba(119, 116, 116, 0.1)",
            }}
          >
            <InputLabel>{t("studentsTable.date")}</InputLabel>
            <Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              label={t("studentsTable.date")}
              sx={{
                height: 49,
              }}
            >
              <MenuItem value="equal">{t("studentsTable.equalTo")}</MenuItem>
              <MenuItem value="greater">
                {t("studentsTable.greaterThan")}
              </MenuItem>
              <MenuItem value="less">{t("studentsTable.lessThan")}</MenuItem>
            </Select>
          </FormControl>

          <TextField
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            InputProps={{
              sx: {
                backgroundColor: "rgba(119, 116, 116, 0.1)",
                width: 140,
                height: 49,
                direction: i18n.language === "ar" ? "rtl" : "ltr",
                "& input": {
                  textAlign: i18n.language === "ar" ? "right" : "left",
                },
              },
            }}
          />
          <IconButton
            onClick={handleSearch}
            sx={{
              height: 49,
              width: 40,
              borderRadius: 2,
              borderTopLeftRadius: i18n.language === "ar" ? 2 : 0,
              borderBottomLeftRadius: i18n.language === "ar" ? 2 : 0,
              borderTopRightRadius: i18n.language === "ar" ? 0 : 2,
              borderBottomRightRadius: i18n.language === "ar" ? 0 : 2,
              border: "1px solid #ccc",
              borderLeft:
                i18n.language === "ar" ? "1px solid #ccc" : "0px solid #ccc", // تعديل الحدود بناءً على اللغة
              borderRight:
                i18n.language === "ar" ? "0px solid #ccc" : "1px solid #ccc", // تعديل الحدود بناءً على اللغة
              "&:hover": {
                backgroundColor: "rgba(119, 116, 116, 0.1)",
              },
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          overflowX: "auto",
          direction: i18n.language === "ar" ? "rtl" : "ltr",
        }}
      >
        <Table sx={{ minWidth: 600 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>{t("studentsTable.firstName")}</StyledTableCell>
              <StyledTableCell>{t("studentsTable.lastName")}</StyledTableCell>
              <StyledTableCell>
                {t("studentsTable.dateOfBirth")}
              </StyledTableCell>
              <StyledTableCell>
                {t("studentsTable.educationalLevel")}
              </StyledTableCell>
              <StyledTableCell>{t("studentsTable.gender")}</StyledTableCell>
              <StyledTableCell>{t("studentsTable.country")}</StyledTableCell>
              <StyledTableCell>{t("studentsTable.city")}</StyledTableCell>
              <StyledTableCell>
                {t("studentsTable.mobileNumber")}
              </StyledTableCell>
              <StyledTableCell>{t("studentsTable.notes")}</StyledTableCell>
              <StyledTableCell>{t("studentsTable.actions")}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>{row.firstName}</StyledTableCell>
                <StyledTableCell>{row.lastName}</StyledTableCell>
                <StyledTableCell>{row.birthDate}</StyledTableCell>
                <StyledTableCell>{row.grade}</StyledTableCell>
                <StyledTableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={row.gender === "Male" ? maleImage : femaleImage}
                      variant="square"
                      sx={{
                        height: 20,
                        width: 13,
                        mx: 1,
                      }}
                    />
                    {row.gender}
                  </Box>
                </StyledTableCell>
                <StyledTableCell>{row.country}</StyledTableCell>
                <StyledTableCell>{row.city}</StyledTableCell>
                <StyledTableCell>{row.phone}</StyledTableCell>
                <StyledTableCell>{row.remarks}</StyledTableCell>
                <StyledTableCell>
                  <Button
                    color="error"
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      params.set("student-id", row.id);
                      navigate({ search: params.toString() });
                    }}
                  >
                    <Avatar
                      src={binImage}
                      variant="square"
                      sx={{
                        height: 24,
                        width: 24,
                        mr: 1,
                        display: { xs: "none", md: "flex" },
                      }}
                    />
                  </Button>
                  <Button onClick={editClickHandler.bind(this, row)}>
                    <Avatar
                      src={pencilImage}
                      variant="square"
                      sx={{
                        height: 24,
                        width: 24,
                        mr: 1,
                        display: { xs: "none", md: "flex" },
                      }}
                    />
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          direction: i18n.language === "ar" ? "rtl" : "ltr",
        }}
      >
        <div>
          {t("studentsTable.rowsPerPage")}:
          <select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            style={{ padding: "5px", borderRadius: "1px" }}
          >
            {[5, 10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <Pagination
          count={Math.ceil(currentRows.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>

      <AddModal
        type="EDIT"
        isOpen={isOpen}
        student={editStudent!}
        onClose={toggleModalHandler}
      />

      <DeleteModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} />
    </>
  );
};

export default StudentsTable;
