from __future__ import annotations

import importlib
from pathlib import Path
import sys

from grpc_tools import protoc


def _project_root() -> Path:
    # src/expose_yfinance/proto_codegen.py -> expose-yfinance/
    return Path(__file__).resolve().parents[2]


def _proto_file() -> Path:
    return _project_root().parents[1] / "src" / "expose-backend" / "Expose" / "Protos" / "yfinance.proto"


def _output_dir() -> Path:
    return _project_root() / "src" / "expose_yfinance" / "_generated"


def ensure_generated() -> None:
    proto_path = _proto_file()
    output_dir = _output_dir()
    output_dir.mkdir(parents=True, exist_ok=True)
    init_file = output_dir / "__init__.py"
    if not init_file.exists():
        init_file.write_text("", encoding="utf-8")

    pb2 = output_dir / "yfinance_pb2.py"
    pb2_grpc = output_dir / "yfinance_pb2_grpc.py"
    should_generate = (
        not pb2.exists()
        or not pb2_grpc.exists()
        or proto_path.stat().st_mtime > min(pb2.stat().st_mtime, pb2_grpc.stat().st_mtime)
    )
    if should_generate:
        result = protoc.main(
            [
                "grpc_tools.protoc",
                f"-I{proto_path.parent}",
                f"--python_out={output_dir}",
                f"--grpc_python_out={output_dir}",
                str(proto_path),
            ]
        )
        if result != 0:
            raise RuntimeError(f"Failed to generate protobuf code (exit code {result}) from {proto_path}")


def load_modules():
    ensure_generated()
    output_dir = _output_dir()
    if str(output_dir) not in sys.path:
        sys.path.insert(0, str(output_dir))
    pb2 = importlib.import_module("yfinance_pb2")
    pb2_grpc = importlib.import_module("yfinance_pb2_grpc")
    return pb2, pb2_grpc
