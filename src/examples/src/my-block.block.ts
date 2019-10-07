import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs';
import { Project, CodeBlockWriter } from 'ts-morph';
import { StructurePrinterFactory } from 'ts-morph/dist/factories';
import { FormatCodeSettings } from "ts-morph/dist/compiler";
import { ManipulationSettingsContainer, SupportedFormatCodeSettings } from "ts-morph/dist/options";
import { fillDefaultFormatCodeSettings } from "ts-morph/dist/utils";

function getDefaultFormatCodeSettings(settings: any = {}): any {
    const manipulationSettingsContainer = new ManipulationSettingsContainer();
    fillDefaultFormatCodeSettings(settings, manipulationSettingsContainer);
    return settings as SupportedFormatCodeSettings;
}

function getStructureFactoryAndWriter(settings?: any) {
    return { writer: new CodeBlockWriter(), factory: getStructureFactory(settings) };
}

function getStructureFactory(settings?: FormatCodeSettings) {
    return new StructurePrinterFactory(() => getDefaultFormatCodeSettings(settings));
}

export default function() {
    const files = glob.sync(path.join(__dirname, 'widgets/**/*'), { nodir: true }) as any;
    const prefix = path.join(__dirname, 'widgets');

    const project = new Project({
        tsConfigFilePath: path.join(__dirname, '..', '..', '..', 'tsconfig.json')
    });

    const sourceFile = project.getSourceFile('./src/text-input/index.ts');
    const propsInterface = sourceFile!.getInterface('TextInputProperties');

    const structure = propsInterface!.getStructure();
    const { writer, factory } = getStructureFactoryAndWriter({});
    console.warn(factory.forInterfaceDeclaration().printText(writer, structure));

    factory.forInterfaceDeclaration().printText(writer, structure);
    console.warn(writer.toString());

    // console.warn(propsInterface!.getStructure());
    // console.warn(propsInterface);
    // for (let i = 0; i < interfaces.length; i++) {
    //     interfaces[i].
    //     console.warn(interfaces[i].getStructure());
    // }
    // interfaces.forEach((int: any) => {
    //     console.warn(int.getStructure());
    // });
    // console.warn(interfaces);

    let results: any[] = [];
    for (let i = 0; i < files.length; i++) {

        results.push({
            path: files[i].replace(prefix, ''),
            content: fs.readFileSync(files[i], 'utf8')
        })
    }
    return results;
}