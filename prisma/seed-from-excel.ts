import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface ControlItemData {
  no: number;
  process: string;
  name: string;
  frequency: string;
  targetDept: string;
  responsibleDept: string;
  sampleForm: string;
  notes: string;
}

async function seedFromExcel() {
  console.log("Reading control items from Excel-extracted JSON...");

  const jsonPath = path.join(__dirname, "../data/control-items.json");
  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const items: ControlItemData[] = JSON.parse(rawData);

  console.log(`Found ${items.length} control items`);

  // Get or create processes
  const processMap = new Map<string, number>();
  const uniqueProcesses = [...new Set(items.map((item) => item.process).filter(Boolean))];

  console.log(`Creating ${uniqueProcesses.length} processes...`);

  let procIdx = 1;
  for (const processName of uniqueProcesses) {
    let process = await prisma.process.findFirst({ where: { name: processName } });
    if (!process) {
      const code = `P${String(procIdx++).padStart(3, '0')}`;
      process = await prisma.process.create({
        data: {
          code,
          name: processName,
          category: "품질",
          isActive: true,
        },
      });
    }
    processMap.set(processName, process.id);
  }

  // Get or create departments
  const deptMap = new Map<string, number>();
  const allDepts = new Set<string>();
  items.forEach((item) => {
    if (item.targetDept) allDepts.add(item.targetDept);
    if (item.responsibleDept) allDepts.add(item.responsibleDept);
  });

  console.log(`Creating ${allDepts.size} departments...`);

  let deptIdx = 1;
  for (const deptName of allDepts) {
    let dept = await prisma.department.findFirst({ where: { name: deptName } });
    if (!dept) {
      const code = `D${String(deptIdx++).padStart(3, '0')}`;
      dept = await prisma.department.create({
        data: {
          code,
          name: deptName,
          isActive: true,
        },
      });
    }
    deptMap.set(deptName, dept.id);
  }

  // Upsert control items
  console.log("Upserting control items...");

  for (const item of items) {
    const processId = item.process ? processMap.get(item.process) : null;
    const targetDeptId = item.targetDept ? deptMap.get(item.targetDept) : null;
    const responsibleDeptId = item.responsibleDept ? deptMap.get(item.responsibleDept) : null;

    await prisma.controlItem.upsert({
      where: { itemNo: item.no },
      update: {
        name: item.name,
        frequency: item.frequency,
        sampleForm: item.sampleForm || null,
        notes: item.notes || null,
        processId,
        targetDeptId,
        responsibleDeptId,
      },
      create: {
        itemNo: item.no,
        name: item.name,
        frequency: item.frequency,
        sampleForm: item.sampleForm || null,
        notes: item.notes || null,
        processId,
        targetDeptId,
        responsibleDeptId,
      },
    });
  }

  console.log(`Successfully seeded ${items.length} control items from Excel!`);
}

seedFromExcel()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
